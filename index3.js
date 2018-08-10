const fs = require('fs');
const protobuf = require("protobufjs");
const redis = require("redis");
const client = redis.createClient({detect_buffers: true});
const Benchmark = require('benchmark');
const {promisify} = require('util');
const Redis = require('ioredis');
const ioredis = new Redis();

const setAsync = promisify(client.set.bind(client));
const getAsync = promisify(client.get.bind(client));

const suite = new Benchmark.Suite();

const result = fs.readFileSync('array.txt').toString().split("\n");
// remove the last undefined record
result.pop();

const eventObjects = _parse({events: result});

function encodeJson() {
  const events = [];
  for(const event of eventObjects) {
    events.push(JSON.stringify(event));
  }
}

const jsonDescriptor = require("./continuity-event.json"); // exemplary for node
const root = protobuf.Root.fromJSON(jsonDescriptor);
// Obtain a message type
const AwesomeMessage = root.lookupType("ContinuityEvent");
const errMsg = AwesomeMessage.verify(eventObjects[0]);
if(errMsg) {
  throw Error(errMsg);
}
const message = AwesomeMessage.create(eventObjects[0]);
// console.log('MMMMMM', message);

// Encode a message to an Uint8Array (browser) or Buffer (node)
const buffer = AwesomeMessage.encode(message).finish();
// ... do something with buffer

// console.log('BBBBBBB', buffer.toString('base64'));

const encodedProtobuf = encodeProtobuf();

// console.log('ZZZZZZZZ', encodedProtobuf);

// Decode an Uint8Array (browser) or Buffer (node) to a message
const d = AwesomeMessage.decode(buffer);
const object = AwesomeMessage.toObject(d, {
  longs: String,
  enums: String,
  bytes: String,
  // see ConversionOptions
});
// console.log('OOOOOO', object);

function encodeProtobuf() {
  const events = [];
  for(const event of eventObjects) {
    const message = AwesomeMessage.create(event);
    events.push(AwesomeMessage.encode(message).finish());
  }
  return events;
}

function decodeProtobuf() {
  const events = [];
  for(const event of encodedProtobuf) {
    try {
      events.push(AwesomeMessage.decode(Buffer.from(event, 'binary')));
    } catch(e) {
      console.log('EEEEEEEEEEEEE', e);
    }
  }
}

function decodeJson() {
  const events = [];
  for(const event of result) {
    events.push(JSON.parse(event));
  }
  // console.log('EEEEEEEE', eventMap);
}

function _parse({events}) {
  const result = [];
  for(const event of events) {
    result.push(JSON.parse(event));
  }
  return result;
}

// suite
//   .add('encode JSON', () => encodeJson())
//   .add('encode Protobuf', () => encodeProtobuf())
//   .add('parse JSON', () => decodeJson())
//   .add('decode Protobuf', () => decodeProtobuf())
//   .on('cycle', event => {
//     console.log(String(event.target));
//   })
//   .on('complete', function() {
//     console.log('Fastest is ' + this.filter('fastest').map('name'));
//   })
//   .run();

async function run() {
  await setAsync('test_json', result[0]);
  await setAsync(
    'test_protobuf',
    AwesomeMessage.encode(message).finish().toString('binary')
  );
  await setAsync('test_protobuf2', AwesomeMessage.encode(message).finish());
  await ioredis.set(
    'ioredis_protobuf', AwesomeMessage.encode(message).finish());
  console.time('a');
  const events = [];
  for(let i = 0; i < 10000; ++i) {
    const x = await getAsync('test_json');
    events.push(JSON.parse(x));
  }
  console.timeEnd('a');

  console.time('b');
  const events2 = [];
  for(let i = 0; i < 10000; ++i) {
    const x = await getAsync('test_protobuf');
    events2.push(AwesomeMessage.decode(Buffer.from(x, 'binary')));
  }
  console.timeEnd('b');

  console.time('b.2');
  const eventsb2 = [];
  for(let i = 0; i < 10000; ++i) {
    const x = await getAsync(Buffer.from('test_protobuf2'));
    eventsb2.push(AwesomeMessage.toObject(AwesomeMessage.decode(x)));
  }
  console.timeEnd('b.2');

  console.time('c');
  const events3 = [];
  for(let i = 0; i < 10000; ++i) {
    const x = await ioredis.getBuffer('ioredis_protobuf');
    events3.push(AwesomeMessage.decode(x));
  }
  console.timeEnd('c');
}

run().then(() => {
  process.exit();
}).catch(e => {
  console.error(e);
  process.exit(1);
});
