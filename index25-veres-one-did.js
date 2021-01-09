const _ = require('lodash');
// const bs58 = require('base58-universal');
const {contexts} = require('web-ledger-context');
// const crypto = require('crypto');
const jsonld = require('jsonld');
const didDocument = require('./veres-one-did.json');

async function documentLoader(url) {
  if(contexts.has(url)) {
    return {
      contextUrl: null,
      document: contexts.get(url),
      documentUrl: url
    };
  }
}

const EVENT_COUNT = 1;

function generateEvents() {
  const events = [];
  for(let i = 0; i < EVENT_COUNT; ++i) {
    const doc = _.cloneDeep(didDocument);
    // event.proof.created = new Date().toISOString();
    events.push(doc);
  }
  return events;
}

(async () => {
  const events = generateEvents();
  for(const event of events) {
    const t = await jsonld.toRDF(event, {
      format: 'application/n-quads',
      documentLoader
    });
    process.stdout.write(t);
  }
})();
