const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

const opJsons = require('./arrayOfJson');

function loop1() {
  return opJsons.map(JSON.parse);
}

function loop2() {
  const list = [];
  for(const json of opJsons) {
    list.push(JSON.parse(json));
  }
  return list;
}

function loop3() {
  return JSON.parse('[' + opJsons.join(',') + ']');
}

function loop4() {
  return JSON.parse(`[${opJsons.join()}]`);
}

const justParse = `[${opJsons.join()}]`;
function loop5() {
  return JSON.parse(justParse);
}

function loop6() {
  let i = 0;
  const list = new Array(opJsons.length);
  for(const json of opJsons) {
    list[i++] = JSON.parse(json);
  }
  return list;
}

suite
  .add('.map(JSON.parse) loop', () => loop1())
  .add('for of JSON.parse loop', () => loop2())
  .add('JSON.parse once string concat', () => loop3())
  .add('JSON.parse once template string', () => loop4())
  .add('JSON.parse once just parse', () => loop5())
  .add('prealloc array JSON.parse loop', () => loop6())
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
