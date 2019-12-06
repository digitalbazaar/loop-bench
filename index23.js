const axios = require('axios');
const Benchmark = require('benchmark');
const v1 = require('did-veres-one');
const https = require('https');
const jsigs = require('jsonld-signatures');
const {WebLedgerClient} = require('web-ledger-client');
const {
  suites: {Ed25519Signature2018}
} = jsigs;
const {CapabilityInvocation} = require('ocapld');

const suite = new Benchmark.Suite();
const _silentLogger = {
  log: () => {},
  warn: () => {},
  error: () => {}
};

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const hostname = 'genesis.veres.one.localhost:42443';

const options = {mode: 'dev', httpsAgent, hostname, logger: _silentLogger};
const veresDriver = v1.driver(options);

const _cache = {};

async function getEndpoints({hostnames}) {
  const promises = hostnames.map(hostname => {
    if(_cache[hostname]) {
      return _cache[hostname];
    }
    const httpsAgent = new https.Agent({rejectUnauthorized: false});
    const client = new WebLedgerClient({hostname: `${hostname}`, httpsAgent});

    return (async () => {
      // there is no benefit in running these in parallel
      const endpoint = await client.getServiceEndpoint(
        {serviceId: 'ledgerOperationService'});
      const targetNode = await client.getTargetNode();
      const target = {endpoint, targetNode, client};
      _cache[hostname] = target;
      return target;
    })();
  });
  return Promise.all(promises);
}

function generate1({deferred}) {
  const didDocs = [];
  veresDriver.generate({}).then(async didDocument => {
    didDocs.push(didDocument);
    deferred.resolve();
  }).catch(e => {
    if(e.response) {
      const {data, status} = e.response;
      if(status !== 204) {
        const err = new Error(
          'Error sending event: server did not respond with 204.');
        console.error('ERROR', err);
        console.error('statusCode', status);
        console.error('body', JSON.stringify(data, null, 2));
      } else {
        console.error('ERROR', e);
        console.error('statusCode', status);
        console.error('body', JSON.stringify(data, null, 2));
      }
    } else {
      console.error(e);
    }
  });
}

function generate2({deferred}) {
  const didDocs = [];
  veresDriver.generate({}).then(async didDocument => {
    didDocs.push(didDocument);
    await getEndpoints({hostnames: [hostname]});
    deferred.resolve();
  }).catch(e => {
    if(e.response) {
      const {data, status} = e.response;
      if(status !== 204) {
        const err = new Error(
          'Error sending event: server did not respond with 204.');
        console.error('ERROR', err);
        console.error('statusCode', status);
        console.error('body', JSON.stringify(data, null, 2));
      } else {
        console.error('ERROR', e);
        console.error('statusCode', status);
        console.error('body', JSON.stringify(data, null, 2));
      }
    } else {
      console.error(e);
    }
  });
}

const arr = [];
const arr0 = [];
const arr1 = [];
const arr2 = [];

function generate3({deferred}) {
  const didDocs = [];
  const timer = getTimer();
  veresDriver.generate({}).then(async didDocument => {
    arr.push(timer.elapsed());
    didDocs.push(didDocument);
    const {doc} = didDocument;
    const timer0 = getTimer();
    const [target] = await getEndpoints({hostnames: [hostname]});
    arr0.push(timer0.elapsed());
    const timer1 = getTimer();
    // let operation = {
    //   '@context': 'https://w3id.org/webledger/v1',
    //   creator: target.targetNode,
    //   type: 'CreateWebLedgerRecord',
    //   record: doc
    // };
    // operation = await veresDriver.attachProofs(
    //   {operation, options: {didDocument}});
    const operation = await target.client.wrap({record: doc});

    // FIXME: this is a mock accelerator proof that is only schema validated
    operation.proof = {
      type: 'Ed25519Signature2018',
      created: '2019-01-10T23:10:25Z',
      capability: 'did:v1:uuid:c37e914a-1e2a-4d59-9668-ee93458fd19a',
      capabilityAction: 'write',
      jws: 'MOCKPROOF',
      proofPurpose: 'capabilityInvocation',
      verificationMethod: 'did:v1:nym:z279yHL6HsxRzCPU78DAWgZVieb8xPK1mJKJBb' +
        'P8T2CezuFY#z279tKmToKKMjQ8tsCgTbBBthw5xEzHWL6GCqZyQnzZr7wUo'
    };
    // get private key
    const invokeKeyNode = didDocument.getVerificationMethod({
      proofPurpose: 'capabilityInvocation'
    });
    const capabilityInvocationKey = didDocument.keys[invokeKeyNode.id];
    const signedOperation = await jsigs.sign(operation, {
      compactProof: false,
      documentLoader: v1.documentLoader,
      suite: new Ed25519Signature2018({key: capabilityInvocationKey}),
      purpose: new CapabilityInvocation({
        capability: didDocument.id,
        capabilityAction: 'create'
      })
    });
    arr1.push(timer1.elapsed());
    const timer2 = getTimer();
    // await axios.post(target.endpoint, signedOperation, {httpsAgent});
    await target.client.sendOperation({operation: signedOperation});
    arr2.push(timer2.elapsed());
    deferred.resolve();
  }).catch(e => {
    if(e.response) {
      const {data, status} = e.response;
      if(status !== 204) {
        const err = new Error(
          'Error sending event: server did not respond with 204.');
        console.error('ERROR', err);
        console.error('statusCode', status);
        console.error('body', JSON.stringify(data, null, 2));
      } else {
        console.error('ERROR', e);
        console.error('statusCode', status);
        console.error('body', JSON.stringify(data, null, 2));
      }
    } else {
      console.error(e);
    }
  });
}

function generate4({deferred}) {
  const didDocs = [];
  veresDriver.generate({}).then(async didDocument => {
    didDocs.push(didDocument);
    await veresDriver.register({didDocument});
    deferred.resolve();
  }).catch(e => {
    if(e.response) {
      const {data, status} = e.response;
      if(status !== 204) {
        const err = new Error(
          'Error sending event: server did not respond with 204.');
        console.error('ERROR', err);
        console.error('statusCode', status);
        console.error('body', JSON.stringify(data, null, 2));
      } else {
        console.error('ERROR', e);
        console.error('statusCode', status);
        console.error('body', JSON.stringify(data, null, 2));
      }
    } else {
      console.error(e);
    }
  });
}

suite
  .add('generate did document', {
    defer: true,
    fn: function(deferred) {
      generate1({deferred});
    }
  })
  .add('generate did document and gather endpoints', {
    defer: true,
    fn: function(deferred) {
      generate2({deferred});
    }
  })
  .add('generate did document, gather endpoints, and send did document', {
    defer: true,
    fn: function(deferred) {
      generate3({deferred});
    }
  })
  .add('generate did document and send did document w/ did-veres-one', {
    defer: true,
    fn: function(deferred) {
      generate4({deferred});
    }
  })
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
    console.log(`Create DID - ${average(arr)}`);
    console.log(`Gather endpoints - ${average(arr0)}`);
    console.log(`Attach Proof Duration - ${average(arr1)}`);
    console.log(`Send Operation Duration - ${average(arr2)}`);

  })
  .run();

function getTimer() {
  const NS_PER_SEC = 1000000000;
  const NS_PER_MS = 1000000;
  const time = process.hrtime();

  return {
    elapsed() {
      const [seconds, nanoseconds] = process.hrtime(time);
      return (seconds * NS_PER_SEC + nanoseconds) / NS_PER_MS;
    }
  };
}

function average(nums) {
  return nums.reduce((a, b) => (a + b)) / nums.length;
}
