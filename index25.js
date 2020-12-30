const _ = require('lodash');
const bs58 = require('base58-universal');
const {contexts} = require('web-ledger-context');
const crypto = require('crypto');
const jsonld = require('jsonld');
const mergeEventRecord = require('./continuity-merge-event.json');

async function documentLoader(url) {
  if(contexts.has(url)) {
    return {
      contextUrl: null,
      document: contexts.get(url),
      documentUrl: url
    };
  }
}

function generateEvents() {
  const events = [];
  const {event: mergeEvent} = mergeEventRecord;
  mergeEvent.parentHash = [];
  for(let i = 0; i < 100000; ++i) {
    const event = _.cloneDeep(mergeEvent);
    const md = crypto.createHash('sha256');
    // FIXME:
    // event.proof.created = new Date().toISOString();
    event.proof.created = '2020-12-29T21:12:26';
    event.treeHash =
      bs58.encode(md.digest(md.update(Math.random().toString())));
    for(let i = 0; i < 13; ++i) {
      const md = crypto.createHash('sha256');
      const rand = bs58.encode(md.digest(md.update(Math.random().toString())));
      event.parentHash.push(rand);
    }
    events.push(event);
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
