/* Sample output
object equality x 6,452,322 ops/sec ±0.47% (91 runs sampled)
value equality x 6,441,100 ops/sec ±1.39% (83 runs sampled)
Fastest is object equality
*/
const _ = require('lodash');
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

const a = {someKey: 'zQmVh4BZNGbs5i3s9DwW2V3CEjRWLTsV8RVgWPz8HLCKGPx'};
const b = {someKey: 'zQmdxyaT32fqDJAs7CyDKgYXvFcJ2vobWkBhaWUkfYsTESv'};

const anArray = [a, a, b, a, b, b, b, b, a, a, b, a];

// object in
function loop1() {
  _.uniq(anArray);
}

// set has
function loop2() {
  _.uniq(anArray, 'someKey');
}

suite
  .add('object equality', () => loop1())
  .add('value equality', () => loop2())
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
