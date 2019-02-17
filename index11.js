/* Sample output
test for empty array x 200,995,845 ops/sec ±0.78% (87 runs sampled)
just push the empty array x 54,473,703 ops/sec ±0.34% (88 runs sampled)
Fastest is test for empty array
*/
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

const emptyArray = [];
const targetArray = [];

// test empty array before push
function loop1() {
  if(emptyArray.length > 0) {
    // never happens in this test
    targetArray.push(...emptyArray);
  }
}

// just push the empty array
function loop2() {
  targetArray.push(...emptyArray);
}

suite
  .add('test for empty array', () => loop1())
  .add('just push the empty array', () => loop2())
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
