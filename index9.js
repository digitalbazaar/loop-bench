const fs = require('fs');
const Benchmark = require('benchmark');
const fastJson = require('fast-json-stringify');

const schema = {
  title: 'Continuity2017 ContinuityMergeEvent',
  additionalProperties: false,
  required: ['@context', 'parentHash', 'proof', 'treeHash', 'type'],
  type: 'object',
  properties: {
    '@context': {type: 'string'},
    parentHash: {
      type: 'array',
      items: {
        type: 'string'
      },
      minItems: 2,
      maxItems: 50
    },
    proof: {
      type: 'object',
      properties: {
        type: {type: 'string'},
        created: {type: 'string'},
        creator: {type: 'string'},
        jws: {type: 'string'}
      }
    },
    treeHash: {
      type: 'string'
    },
    type: {
      type: 'string',
      enum: ['ContinuityMergeEvent']
    },
  }
};

const fastStringify = fastJson(schema);

const suite = new Benchmark.Suite();

const {event, meta} = JSON.parse(fs.readFileSync(
  'continuity-merge-event.json'));

function loop1() {
  const x = fastStringify(event);
    // console.log('11111', x);
  // const sizes = [];
  // for(let i = 0; i < result.length; ++i) {
  //   sizes.push(result[i].length);
  // }
  // console.log('1111', sizes);
}

function loop2() {
  const x = JSON.stringify(event);
}

suite
  .add('fast-json-stringify', () => loop1())
  .add('json-stringify', () => loop2())
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
