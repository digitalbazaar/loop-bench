const fs = require('fs');
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

const result = fs.readFileSync('array.txt').toString().split("\n");
// remove the last undefined record
result.pop();

function loop1() {
  const sizes = [];
  for(let i = 0; i < result.length; ++i) {
    sizes.push(result[i].length);
  }
  // console.log('1111', sizes);
}

function loop2() {
  const sizes = [];
  for(let i = 0; i < result.length; ++i) {
    sizes.push(Buffer.byteLength(result[i], 'utf8'));
  }
  // console.log('22222', sizes);
}

suite
  .add('string.length', () => loop1())
  .add('buffer.byteLength', () => loop2())
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
