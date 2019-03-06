// test jsonld.canonize on Continuity merge events with varios numbers of
// parentHash items. Also able to compare native vs js.

const jsonld = require('jsonld');
const Benchmark = require('benchmark');
const webLedgerContext = require('web-ledger-context');
const crypto = require('crypto');
const multibase = require('multibase');
const multihash = require('multihashes');

const suite = new Benchmark.Suite();

/* eslint-disable quotes, max-len, quote-props */
const eventOne = {
  "@context": "https://w3id.org/webledger/v1",
  "type": "ContinuityMergeEvent",
  "parentHash": [
    "zQmVhr95TGmncgbWTnx46stnAV5FmAdqeiiij2sMFBLdZTq",
    "zQmfPNftoEPDVcccDa6mZ1ieeoRJ1moKNikoiCfM8Q2nXJo",
    "zQmVC9oN7CbTAkns15gXoUjMj19aAiS2Kqu3RoRVRLEgh98",
    "zQmNNKwK8mNfD2GuAnNXSKNdoioHB8LHVBVH9bKmTJs3WYP",
    "zQmVbWnQbKDzdY2iR5rdeFvaMBYEErHvvvB9aaocb9zQrV8"
  ],
  "treeHash": "zQmVhr95TGmncgbWTnx46stnAV5FmAdqeiiij2sMFBLdZTq",
  "proof": {
    "type": "Ed25519Signature2018",
    "created": "2019-03-05T22:06:56Z",
    "verificationMethod": "https://bedrock.localhost:18443/consensus/continuity2017/voters/z6MkjAisz6TZkDwJ8Sm2JBpGL6vjYFrK91YgU4xVBHPWwLDm",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Cik4LTzcRNx4eOjNZ4S2z0iTj2Hh-LV8jfT1FU2jmyV6_tfO8ZSB_DMyu55_QKTT_dmNol5ixmIVNy8-VmKqAg"
  }
};
const eventTwo = JSON.parse(JSON.stringify(eventOne));
eventTwo.parentHash = [
  "zQmVhr95TGmncgbWTnx46stnAV5FmAdqeiiij2sMFBLdZTq",
  "zQmfPNftoEPDVcccDa6mZ1ieeoRJ1moKNikoiCfM8Q2nXJo"
];
/* eslint-enable */
const WEB_LEDGER_CONTEXT_V1_URL = 'https://w3id.org/webledger/v1';
const contexts = new Map();
contexts.set(WEB_LEDGER_CONTEXT_V1_URL, webLedgerContext);

jsonld.documentLoader = async url => {
  if(contexts.has(url)) {
    return {
      contextUrl: null,
      document: contexts.get(url),
      documentUrl: url
    };
  }
};

function normalize(deferred, event) {
  jsonld.canonize(event, {
    algorithm: 'URDNA2015',
    format: 'application/n-quads',
    // useNative: true
  }).then(() => {
    deferred.resolve();
  }).catch(err => {
    console.log('ERROR', err);
  });
}

const rTimes = [];
for(let i = 0; i < 40; ++ i) {
  const e = JSON.parse(JSON.stringify(eventOne));
  // increase the number of hashes by 5 for each test
  for(let t = 0; t < i * 5; ++t) {
    const hash = crypto.createHash('sha256')
      .update(crypto.randomBytes(32)).digest();
    const mh = multihash.encode(hash, 'sha2-256');
    const mb = multibase.encode('base58btc', mh).toString();
    e.parentHash.push(mb);
  }
  suite
    .add(`normalize parentHash length ${e.parentHash.length}`, {
      minSamples: 200,
      defer: true,
      fn: function(deferred) {
        normalize(deferred, e);
      }
    });
}
suite
  .on('cycle', event => {
    rTimes.push(Math.round(event.target.hz));
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
    for(const t of rTimes) {
      console.log(t);
    }
  })
  .run();
