const {contexts} = require('web-ledger-context');
const jsonld = require('jsonld');

/* eslint-disable max-len */
const event = {
  '@context': 'https://w3id.org/webledger/v1',
  type: 'ContinuityMergeEvent',
  proof: {
    // type: 'Ed25519Signature2018',
    created: '2018-12-21T23:40:20Z',
    creator: 'https://bedrock.localhost:18443/consensus/continuity2017/voters/z6MkkabTusFkLnquxwHwCm28v59UX3P9Pn5scvc7fCaNvWUL',
    // jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..JJ5c7mF7ru9XhPtrNqj1s6J74yqOC0HcNyK_Wa0OcfDaiODZFIJ2dXIrc_qqqvTWynIqJid6yXkKsGAzyi_HDQ'
  }
};

async function documentLoader(url) {
  if(contexts.has(url)) {
    return {
      contextUrl: null,
      document: contexts.get(url),
      documentUrl: url
    };
  }
}

(async () => {
  const t = await jsonld.toRDF(event, {
    format: 'application/n-quads',
    documentLoader
  });
  process.stdout.write(t);
})();
