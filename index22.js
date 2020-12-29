const Benchmark = require('benchmark');
const rdfCanonize = require('rdf-canonize');
const rdfCanonizeRust =
require('./rdf-canonize-rust/index.node');
const quads = require('./quads.json');
const quads2 = require('./quads2.json');
const quadsMergeEvent = require('./quads-merge-event.json');
const suite = new Benchmark.Suite();

function canonize(deferred, quads) {
  rdfCanonize.canonize(...quads)
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
  .add('Rust canonize quadsMergeEvent sync', {
    minSamples: 100,
    fn: () => rdfCanonizeRust.canonize(...quadsMergeEvent)
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
  .add('JS canonize quadsMergeEvent', {
    minSamples: 100,
    defer: true,
    fn: function(deferred) {
      canonize(deferred, quadsMergeEvent);
    }
  })
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
