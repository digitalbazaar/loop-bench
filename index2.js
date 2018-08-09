const fs = require('fs');
const Benchmark = require('benchmark');
const base64url = require('base64url');
const crypto = require('crypto');

const suite = new Benchmark.Suite();

const result = fs.readFileSync('array.txt').toString().split("\n");
// remove the last undefined record
result.pop();

const mergeEventHashes = result.map(e => {
  const event = JSON.parse(e);
  return event.eventHash;
});

let eventHashBuffers = [];

function loop1() {
  mergeEventHashes.sort((a, b) => a.localeCompare(b));
  const baseHash = _sha256(mergeEventHashes.join(''));
  const result = [];
  for(const hash of mergeEventHashes) {
    result.push(_sha256(baseHash + hash));
  }
}

function loop2() {
  eventHashBuffers = [];
  const baseHashBuffer = _createBaseHashBuffer(mergeEventHashes);
  const result = [];
  for(let i = 0; i < eventHashBuffers.length; ++i) {
    result.push(_xor(eventHashBuffers[i], baseHashBuffer));
  }
}

function _sha256(x) {
  return crypto.createHash('sha256').update(x).digest('hex');
}

function _createBaseHashBuffer(mergeEventHashes) {
  const p = _parseHash(mergeEventHashes[0]);
  eventHashBuffers.push(p);
  const buf = p.slice();
  for(let i = 1; i < mergeEventHashes.length; ++i) {
    const p = _parseHash(mergeEventHashes[i]);
    eventHashBuffers.push(p);
    _xor(buf, p);
  }
  return buf;
}

function _xor(b1, b2) {
  const len = b1.length;
  for(let i = 0; i < len; ++i) {
    b1[i] ^= b2[i];
  }

/*
  const ub1 = new Uint32Array(b1.buffer, b1.byteOffset, b1.byteLength / 4);
  const ub2 = new Uint32Array(b2.buffer, b2.byteOffset, b2.byteLength / 4);
  for(let i = 0; i < ub1.length; ++i) {
    ub1[i] ^= ub2[i];
  }*/
}

function _parseHash(hash) {
  return new Buffer(hash.substr(14));
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
