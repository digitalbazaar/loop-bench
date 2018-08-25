const fs = require('fs');
const msgpack = require('msgpack5')();
const protobuf = require("protobufjs");
const Benchmark = require('benchmark');

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
const encodedProtobufBuffers = encodeProtobufBuffers();
const encodedMsgPackBuffers = encodeMsgpack();

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

function encodeMsgpack() {
  const events = [];
  for(const event of eventObjects) {
    events.push(msgpack.encode(event));
  }
  return events;
}

function encodeProtobuf() {
  const events = [];
  for(const event of eventObjects) {
    const message = AwesomeMessage.create(event);
    events.push(AwesomeMessage.encode(message).finish().toString('binary'));
  }
  return events;
}

function encodeProtobufBuffers() {
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
    events.push(AwesomeMessage.toObject(
      AwesomeMessage.decode(Buffer.from(event, 'binary'))));
  }
}

function decodeMsgPackBuffers() {
  const events = [];
  for(const event of encodedMsgPackBuffers) {
    events.push(msgpack.decode(event));
  }
}

function decodeProtobufBuffers() {
  const events = [];
  for(const event of encodedProtobufBuffers) {
    events.push(AwesomeMessage.toObject(AwesomeMessage.decode(event)));
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

suite
  .add('encode JSON', () => encodeJson())
  .add('encode Msgpack', () => encodeMsgpack())
  .add('encode Protobuf', () => encodeProtobuf())
  .add('encode Protobuf Buffers', () => encodeProtobufBuffers())
  .add('parse JSON', () => decodeJson())
  .add('parse msgPack', () => decodeMsgPackBuffers())
  .add('decode Protobuf', () => decodeProtobuf())
  .add('decode Protobuf Buffers', () => decodeProtobufBuffers())
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
