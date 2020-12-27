const _ = require('lodash');
const bs58 = require('base58-universal');
const rdfCanonize = require('rdf-canonize');
const rdfCanonizeRust =
  require('../rust-node-bindgen-canonize/dist/index.node');
const quadsMergeEvent = require('./quads-merge-event.json');
const crypto = require('crypto');
const utils = require('./utils');

const events = [];
for(let i = 0; i < 100000; ++i) {
  const event = _.clone(quadsMergeEvent);
  const md = crypto.createHash('sha256');
  const rand = bs58.encode(md.digest(md.update(Math.random().toString())));
  // console.log('rv', rand);
  // console.log(event[0][3].object.value);
  event[0][3].object.value = rand;
  events.push(event);
}

const fns = new Map([
  ['rdfCanonizeRust', rdfCanonizeRust.canonize],
  ['rdfCanonize', rdfCanonize.canonizeSync],
]);

console.log(`${events.length} Operations`);
console.log('--------------------------------------------');

for(const [lib, canonize] of fns) {
  const timer = utils.getTimer();
  for(const event of events) {
    canonize(...event);
  }
  console.log(`${lib.padStart(20)} Total time: ${timer.elapsed()}`);
}
