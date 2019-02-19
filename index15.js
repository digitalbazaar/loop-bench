/* Sample output
encode - Uint8Array short x 2,484,990 ops/sec ±0.78% (87 runs sampled)
encode - Buffer short x 2,383,750 ops/sec ±0.78% (91 runs sampled)
encode - Uint8Array medium x 504,028 ops/sec ±0.80% (87 runs sampled)
encode - Buffer medium x 1,620,050 ops/sec ±0.61% (87 runs sampled)
encode - Uint8Array long x 43,429 ops/sec ±0.58% (90 runs sampled)
encode - Buffer long x 431,807 ops/sec ±0.49% (89 runs sampled)
*/
// this implementation use Uint8Array
const base64url1 = require('./base64url');
// this implementation uses Buffer
const base64url2 = require('base64url');
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

const short = Buffer.from('6245lj K2645lkj');
const medium = Buffer.from(
  '6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lj');
const long = Buffer.from(
  '6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lj' +
  '6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lj' +
  '6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lj' +
  '6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lj' +
  '6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lj' +
  '6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lj' +
  '6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lj' +
  '6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lj' +
  '6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lj' +
  '6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lj' +
  '6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lj' +
  '6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lj' +
  '6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lj' +
  '6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lkj6245lj K2645lj'
);

// object in
function loop1(buffer) {
  base64url1.encode(buffer);
}

// set has
function loop2(buffer) {
  base64url2.encode(buffer);
}

suite
  .add('encode - Uint8Array short', () => loop1(short))
  .add('encode - Buffer short', () => loop2(short))
  .add('encode - Uint8Array medium', () => loop1(medium))
  .add('encode - Buffer medium', () => loop2(medium))
  .add('encode - Uint8Array long', () => loop1(long))
  .add('encode - Buffer long', () => loop2(long))
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
