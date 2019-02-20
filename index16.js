/* Sample output
concat aString x 3,413,371 ops/sec ±0.77% (91 runs sampled)
concat anArray x 5,090,522 ops/sec ±1.59% (91 runs sampled)
isArray aString x 3,420,074 ops/sec ±0.83% (90 runs sampled)
isArray anArray x 662,072,785 ops/sec ±2.06% (81 runs sampled)
*/
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

const aString = 'c721c365-eae8-4150-ae12-d040cd5d5784';
const anArray = [
  'c721c365-eae8-4150-ae12-d040cd5d5784',
  '5ec7b2eb-b23e-4286-8842-4ee6a9aef215',
  'c721c365-eae8-4150-ae12-d040cd5d5784',
  '5ec7b2eb-b23e-4286-8842-4ee6a9aef215',
  'c721c365-eae8-4150-ae12-d040cd5d5784',
  'c721c365-eae8-4150-ae12-d040cd5d5784',
  '5ec7b2eb-b23e-4286-8842-4ee6a9aef215',
  'c721c365-eae8-4150-ae12-d040cd5d5784',
  '5ec7b2eb-b23e-4286-8842-4ee6a9aef215',
];

function loop1(value) {
  return [].concat(value);
}

function loop2(value) {
  return Array.isArray(value) ? value : [value];
}

suite
  .add('concat aString', () => loop1(aString))
  .add('concat anArray', () => loop1(anArray))
  .add('isArray aString', () => loop1(aString))
  .add('isArray anArray', () => loop2(anArray))
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
