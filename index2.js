const fs = require('fs');
const Benchmark = require('benchmark');
const base64url = require('base64url');
const crypto = require('crypto');
const niUri = require('ni-uri');
const xor = require('buffer-xor/inplace');

const suite = new Benchmark.Suite();

const result = fs.readFileSync('array.txt').toString().split("\n");
// remove the last undefined record
result.pop();

const mergeEventHashes = result.map(e => {
  const event = JSON.parse(e);
  return event.eventHash;
});

function loop1() {
  const baseHash = _sha256(mergeEventHashes.join(''));
  const result = [];
  for(const hash of mergeEventHashes) {
    result.push(_sha256(baseHash + hash));
  }
}

function loop2() {
  const baseHashBuffer = _createBaseHashBuffer(mergeEventHashes);
  const result = [];
  for(const hash of mergeEventHashes) {
    result.push(_xorWithBaseHash(baseHashBuffer, hash));
  }
}

function _createBaseHashBuffer(mergeEventHashes) {
  const {value} = niUri.parse(mergeEventHashes[0], true);
  const buf = base64url.toBuffer(value);
  for(let i = 1; i < mergeEventHashes.length; ++i) {
    const {value} = niUri.parse(mergeEventHashes[i], true);
    xor(buf, base64url.toBuffer(value));
  }
  return buf;
}

function _sha256(x) {
  return crypto.createHash('sha256').update(x).digest('hex');
}

function _xorWithBaseHash(baseHashBuffer, eventHash) {
  const {value} = niUri.parse(eventHash, true);
  const buf = base64url.toBuffer(value);
  xor(buf, baseHashBuffer);
  return buf;
}

suite
  .add('sha256', () => loop1())
  .add('xor', () => loop2())
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
