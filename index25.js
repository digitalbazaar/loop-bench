const {getTimer} = require('./utils');
const crypto = require('crypto');
const rustHasher = require('./rust-hash-bench');
const assert = require('assert');

const COUNT = 1000;
const INTERNAL_COUNT = 1000;

function hasher(seed, count) {
    let previous = seed;
    const results = [];
    for (let i = 0; i < count; ++i) {
        const md = crypto.createHash('sha256');
        md.update(previous, 'utf8');
        previous = md.digest('hex')
        results.push(previous);
    }
    return results;
}

let randomValues = [];
for (let i = 0; i < COUNT; ++i) {
    randomValues.push(Math.random());
}

const nodeTimer = getTimer();
const nodeValues = [];
for (const r of randomValues) {
    nodeValues.push(hasher(r.toString(), INTERNAL_COUNT));
}
console.log('NODEJS MS', nodeTimer.elapsed());

const rustTimer = getTimer();
const rustValues = [];
for (const r of randomValues) {
    rustValues.push(rustHasher.hasher(r.toString(), INTERNAL_COUNT));
}
console.log('RUST MS', rustTimer.elapsed());

assert.deepStrictEqual(nodeValues, rustValues);