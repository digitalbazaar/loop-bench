const jsonld = require('jsonld');
const mergeEvent = require('./continuity-merge-event.json');
const {contexts} = require('web-ledger-context');
const quadsMergeEvent = require('./quads-merge-event.json');
const rdfCanonize = require('rdf-canonize');
const rdfCanonizeRust =
  require('../rust-node-bindgen-canonize/dist/index.node');
const assert = require('assert');

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
  try {
    const y = await jsonld.toRDF(mergeEvent.event, {
      format: 'application/n-quads',
      documentLoader
    });
    // console.log('YYYYYYYY', y);
    const t = rdfCanonize.NQuads.parse(y);
    // console.log('TTTTTTTTTT', JSON.stringify(t, null, 2));
  } catch(e) {
    console.log('EEEEEEEEE', e);
  }

  // assert equality for merge event js vs rust
  assert.strictEqual(
    await rdfCanonize.canonize(...quadsMergeEvent),
    rdfCanonizeRust.canonize(...quadsMergeEvent));
  console.log('Assertion Passed');
})().catch(console.error);

