const Benchmark = require('benchmark');
const v1 = require('did-veres-one');

const suite = new Benchmark.Suite();

const veresDriver = v1.driver({});

function generate({deferred}) {
  const didDocs = [];
  veresDriver.generate().then(didDoc => {
    didDocs.push(didDoc);
    deferred.resolve();
  }).catch(err => {
    console.log('ERROR', err);
  });
}

suite
  .add('generate did:v1 document', {
    defer: true,
    fn: function(deferred) {
      generate({deferred});
    }
  })
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
