const canonicalize = require('canonicalize');
const fs = require('fs');
const jsonld = require('jsonld');
const path = require('path');
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

const mergeEventStrings = fs.readFileSync('array.txt').toString().split("\n");
// remove the last undefined record
mergeEventStrings.pop();

const mergeEventObjects = _parse({events: mergeEventStrings});
const oneEvent = mergeEventObjects[0];
const WEB_LEDGER_CONTEXT_V1_URL = 'https://w3id.org/webledger/v1';
const contexts = new Map();
contexts.set(
  WEB_LEDGER_CONTEXT_V1_URL, JSON.parse(fs.readFileSync(
    path.join(__dirname, 'contexts/webledger-v1.jsonld'),
    {encoding: 'utf8'})
  ));

// a Continuity merge event
oneEvent['@context'] = WEB_LEDGER_CONTEXT_V1_URL;

jsonld.documentLoader = async (url) => {
  if(contexts.has(url)) {
    return {
      contextUrl: null,
      document: contexts.get(url),
      documentUrl: url
    };
  }
};

function _parse({events}) {
  const result = [];
  for(const event of events) {
    result.push(JSON.parse(event));
  }
  return result;
}

function canonize() {
  const results = [];
  const c = canonicalize(oneEvent);
  results.push(c);
  return c;
}

function normalize(deferred) {
  const results = [];
  jsonld.canonize(oneEvent, {
    algorithm: 'URDNA2015',
    format: 'application/n-quads'
  }).then(result => {
    results.push(result);
    deferred.resolve();
  }).catch(err => {
    console.log('ERROR', err);
  });
}

suite
  .add('canonicalize', () => canonize())
  .add('normalize', {
    defer: true,
    fn: function(deferred) {
      normalize(deferred);
    }
  })
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
