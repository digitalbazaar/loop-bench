const Benchmark = require('benchmark');
const rdfCanonize = require('rdf-canonize');
const rdfCanonizeRust =
  require('../rust-node-bindgen-canonize/dist/index.node');
const quadsMergeEvent = require('./quads-merge-event.json');
const suite = new Benchmark.Suite();

const sizes = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const SOURCE_DATA = quadsMergeEvent[0];

function canonize(deferred, quads) {
  rdfCanonize.canonize(...quads)
    .then(r => deferred.resolve(r)).catch(console.error);
}

const tests = [];

for(const size of sizes) {
  const arrayOfObjects = [];
  let i = 0;
  while(arrayOfObjects.length < size) {
    arrayOfObjects.push({...SOURCE_DATA[i % SOURCE_DATA.length]});
    ++i;
  }

  const plainString = rdfCanonize.NQuads.serialize(arrayOfObjects);

  tests.push({
    size,
    arrayOfObjects,
    plainString,
    plainStringBuffer: Buffer.from(plainString)
  });
}

for(const {size, plainString, plainStringBuffer} of tests) {
  suite
    .add(`JS rdf-canonize parse + canonize [SIZE=${size}]`, {
      minSamples: 50,
      defer: true,
      fn: function(deferred) {
        canonize(deferred, [
          rdfCanonize.NQuads.parse(plainString), quadsMergeEvent[1]
        ]);
      }
    })
    .add(`Rust canonize plainStringBufferCanonize [SIZE=${size}]`, {
      minSamples: 50,
      fn: () => rdfCanonizeRust.plainStringBufferCanonize(plainStringBuffer)
    })
    .add(`Rust canonize plainStringCanonize [SIZE=${size}]`, {
      minSamples: 50,
      fn: () => rdfCanonizeRust.plainStringCanonize(plainString)
    });
}

suite
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
