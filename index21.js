const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

function loop1(obj, key, value) {
  return [].concat(obj[key]).includes(value);
}
function loop2(obj, key, value) {
  if(Array.isArray(obj[key])) {
    return obj[key].includes(value);
  }
  return obj[key] === value;
}
function loop3({obj, key, value}) {
  if(Array.isArray(obj[key])) {
    return obj[key].includes(value);
  }
  return obj[key] === value;
}

const testObjAlpha = {type: 'Foo'};
const testObjBeta = {type: ['Foo']};
const testObjGamma = {type: ['Foo', 'Bar', 'Cat']};

suite
  .add('concat - string', () => loop1(testObjAlpha, 'type', 'Foo'))
  .add('concat - one element array', () => loop1(testObjBeta, 'type', 'Foo'))
  .add('concat - one element array', () => loop1(testObjGamma, 'type', 'Foo'))

  .add('test - string', () => loop2(testObjAlpha, 'type', 'Foo'))
  .add('test - one element array', () => loop2(testObjBeta, 'type', 'Foo'))
  .add('test - one element array', () => loop2(testObjGamma, 'type', 'Foo'))

  .add('destruct - string', () => loop3(
    {obj: testObjAlpha, key: 'type', value: 'Foo'}))
  .add('destruct - one element array', () => loop3(
    {obj: testObjBeta, key: 'type', value: 'Foo'}))
  .add('destruct - one element array', () => loop3(
    {obj: testObjGamma, key: 'type', value: 'Foo'}))

  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
