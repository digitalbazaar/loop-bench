const Benchmark = require('benchmark');
const rdfCanonize = require('rdf-canonize');
const rdfCanonizeRust =
  require('../rust-node-bindgen-canonize/dist/index.node');
const quads = require('./quads.json');

const suite = new Benchmark.Suite();

function canonize(deferred) {
  rdfCanonize.canonize(...quads).then(r => {
    deferred.resolve(r);
  }).catch(err => {
    console.log('ERROR', err);
  });
}

suite
  .add('Rust canonize', {
    minSamples: 100,
    fn: () => rdfCanonizeRust.canonize(...quads)
  })
  .add('JS canonize', {
    minSamples: 100,
    defer: true,
    fn: function(deferred) {
      canonize(deferred);
    }
  })
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
