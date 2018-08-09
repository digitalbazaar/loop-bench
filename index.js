const fs = require('fs');
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

const result = fs.readFileSync('array.txt').toString().split("\n");
// remove the last undefined record
result.pop();

function loop1() {
  const events = [];
  const eventMap = {};
  for(let i = 0; i < result.length; ++i) {
    // TODO: try/catch?
    const parsed = JSON.parse(result[i]);
    const {eventHash} = parsed;
    const {parentHash, treeHash, type} = parsed.event;
    const {creator} = parsed.meta.continuity2017;
    const doc = {
      _children: [],
      _parents: [],
      eventHash,
      event: {parentHash, treeHash, type},
      meta: {continuity2017: {creator}}
    };
    events.push(doc);
    eventMap[doc.eventHash] = doc;
  }
  // console.log('EEEEEEEE', eventMap);
}

function loop2() {
  const events = [];
  const eventMap = {};
  for(const event of result) {
    // TODO: try/catch?
    const parsed = JSON.parse(event);
    const {eventHash} = parsed;
    const {parentHash, treeHash, type} = parsed.event;
    const {creator} = parsed.meta.continuity2017;
    const doc = {
      _children: [],
      _parents: [],
      eventHash,
      event: {parentHash, treeHash, type},
      meta: {continuity2017: {creator}}
    };
    events.push(doc);
    eventMap[doc.eventHash] = doc;
  }
  // console.log('EEEEEEEE', eventMap);
}

suite
  .add('for i loop', () => loop1())
  .add('for of loop', () => loop2())
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
