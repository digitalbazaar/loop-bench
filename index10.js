const fs = require('fs');
const jsonld = require('jsonld');
const path = require('path');
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

const WEB_LEDGER_CONTEXT_V1_URL = 'https://w3id.org/webledger/v1';
const SCHEMA_URL = 'https://schema.org/';
const TEST_CONTEXT_V1_URL = 'https://w3id.org/test/v1';
const contexts = new Map();
contexts.set(WEB_LEDGER_CONTEXT_V1_URL, require('web-ledger-context'));
contexts.set(SCHEMA_URL, JSON.parse(fs.readFileSync(
  path.join(__dirname, './contexts/schema.jsonld'), {encoding: 'utf8'})));
contexts.set(TEST_CONTEXT_V1_URL, JSON.parse(fs.readFileSync(
  path.join(__dirname, './contexts/test-v1.jsonld'), {encoding: 'utf8'})));

/* eslint-disable max-len */
const operationTestContext = {
  '@context': WEB_LEDGER_CONTEXT_V1_URL,
  type: 'CreateWebLedgerRecord',
  creator: 'https://example.com/1234',
  record: {
    '@context': TEST_CONTEXT_V1_URL,
    'id': 'https://example.com/transaction/1a361e9f-9aa0-48a2-b7eb-2c93607bb5ec',
    price: Math.floor(Math.random() * 1000000000000),
  },
  proof: {
    type: 'Ed25519Signature2018',
    created: '2018-02-19T14:48:48Z',
    creator: 'did:v1:test:nym:8IyxSpzUFcby2pe_oSdsbjb_1hLjo0eqaQSNRPrpUxw#ocap-invoke-key-1',
    capability: 'did:v1:test:nym:8IyxSpzUFcby2pe_oSdsbjb_1hLjo0eqaQSNRPrpUxw',
    capabilityAction: 'CreateWebLedgerRecord',
    jws: 'eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..u-alElcqe_xri6GLL10Ozi1LwLO9HpUXmsRqnjTa7jhAf1pFbAjdGDNhDjg0QvCIw',
    proofPurpose: 'invokeCapability'
  }
};
const operationSchemaContext = {
  '@context': WEB_LEDGER_CONTEXT_V1_URL,
  type: 'CreateWebLedgerRecord',
  creator: 'https://example.com/1234',
  record: {
    '@context': SCHEMA_URL,
    'id': 'https://example.com/transaction/1a361e9f-9aa0-48a2-b7eb-2c93607bb5ec',
    lowPrice: Math.floor(Math.random() * 100000000000),
  },
  proof: {
    type: 'Ed25519Signature2018',
    created: '2018-02-19T14:48:48Z',
    creator: 'did:v1:test:nym:8IyxSpzUFcby2pe_oSdsbjb_1hLjo0eqaQSNRPrpUxw#ocap-invoke-key-1',
    capability: 'did:v1:test:nym:8IyxSpzUFcby2pe_oSdsbjb_1hLjo0eqaQSNRPrpUxw',
    capabilityAction: 'CreateWebLedgerRecord',
    jws: 'eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..u-alElcqe_xri6GLL10Ozi1LwLO9HpUXmsRqnjTa7jhAf1pFbAjdGDNhDjg0QvCIw',
    proofPurpose: 'invokeCapability'
  }
};

jsonld.documentLoader = async url => {
  if(contexts.has(url)) {
    return {
      contextUrl: null,
      document: contexts.get(url),
      documentUrl: url
    };
  }
};

function expand({deferred, document}) {
  const results = [];
  jsonld.expand(document).then(result => {
    results.push(result);
    deferred.resolve();
  }).catch(err => {
    console.log('ERROR', err);
  });
}

suite
  .add('expand test context', {
    defer: true,
    fn: function(deferred) {
      expand({deferred, document: operationTestContext});
    }
  })
  .add('expand schema context', {
    defer: true,
    fn: function(deferred) {
      expand({deferred, document: operationSchemaContext});
    }
  })
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
