const Benchmark = require('benchmark');
const rdfCanonize = require('rdf-canonize');
const rdfCanonizeRust =
  require('../rust-node-bindgen-canonize/dist/index.node');
const quads = require('./quads.json');
const quads2 = require('./quads2.json');
const suite = new Benchmark.Suite();

function canonize(deferred, q) {
  rdfCanonize.canonize(...q)
    .then(r => deferred.resolve(r)).catch(console.error);
}

suite
  .add('Rust canonize quads sync', {
    minSamples: 100,
    fn: () => rdfCanonizeRust.canonize(...quads)
  })
  .add('Rust canonize quads2 sync', {
    minSamples: 100,
    fn: () => rdfCanonizeRust.canonize(...quads2)
  })
  .add('JS canonize quads', {
    minSamples: 100,
    defer: true,
    fn: function(deferred) {
      canonize(deferred, quads);
    }
  })
  .add('JS canonize quads2', {
    minSamples: 100,
    defer: true,
    fn: function(deferred) {
      canonize(deferred, quads2);
    }
  })
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
