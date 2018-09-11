const fs = require('fs');
const jsonld = require('jsonld');
const path = require('path');

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

function canonize(event) {
  return jsonld.canonize(event, {
    algorithm: 'URDNA2015',
    format: 'application/n-quads'
  }).catch(e => console.error(e));
}

async function work() {
  const done = false;
  while(!done) {
    console.time('canonize');
    for(const {event} of mergeEventObjects) {
      event['@context'] = WEB_LEDGER_CONTEXT_V1_URL;
      await canonize(event);
    }
    console.timeEnd('canonize');
  }
}

function _parse({events}) {
  const result = [];
  for(const event of events) {
    result.push(JSON.parse(event));
  }
  return result;
}

work()
  .then(() => {
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
