const {add, cycle, complete, suite} = require('benny');
const rdfCanonize = require('rdf-canonize');
const rdfCanonizeRust =
  require('../rust-node-bindgen-canonize/dist/index.node');
const quads = require('./quads.json');
const quads2 = require('./quads2.json');
const quadsMergeEvent = require('./quads-merge-event.json');

suite(
  'rdf-canonize quads',
  add('Rust canonize ', () => {
    rdfCanonizeRust.canonize(...quads);
  }),
  add('JS canonizeSync', () => {
    rdfCanonize.canonizeSync(...quads);
  }),
  cycle(),
  complete(),
);

suite(
  'rdf-canonize quads2',
  add('Rust canonize', () => {
    rdfCanonizeRust.canonize(...quads2);
  }),
  add('JS canonizeSync', () => {
    rdfCanonize.canonizeSync(...quads2);
  }),
  cycle(),
  complete(),
);

suite(
  'rdf-canonize quadsMergeEvent',
  add('Rust canonize ', () => {
    rdfCanonizeRust.canonize(...quadsMergeEvent);
  }),
  add('JS canonizeSync', () => {
    rdfCanonize.canonizeSync(...quadsMergeEvent);
  }),
  cycle(),
  complete(),
);
