const assert = require('assert');
const fs = require('fs');
const msgpack = require('msgpack5')();
const protobuf = require("protobufjs");
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

const mergeEventStrings = fs.readFileSync('array.txt').toString().split("\n");
// remove the last undefined record
mergeEventStrings.pop();

const mergeEventObjects = _parse({events: mergeEventStrings});

function encodeJson() {
  const events = [];
  for(const event of mergeEventObjects) {
    events.push(JSON.stringify(event));
  }
}

// setup and test Protobuf
// load descriptor for Continuity merge events
const root = protobuf.Root.fromJSON(require("./continuity-event.json"));
// Obtain a message type
const ContinuityMessage = root.lookupType("ContinuityEvent");
// ensure that the schema is valid for the data
const errMsg = ContinuityMessage.verify(mergeEventObjects[0]);
if(errMsg) {
  throw Error(errMsg);
}
const message = ContinuityMessage.create(mergeEventObjects[0]);
// Encode a message to an Uint8Array (browser) or Buffer (node)
const buffer = ContinuityMessage.encode(message).finish();
// send the buffer somewhere: redis(after encoding), over the wire
const mergeEventZeroMessage = ContinuityMessage.decode(buffer);
assert.deepEqual(ContinuityMessage.toObject(
  mergeEventZeroMessage), mergeEventObjects[0]);
// end Protobuf testing

// encode protobuf buffers into a variety of string encodings
const encodedProtobuf = {base64: '', binary: '', hex: ''};
Object.keys(encodedProtobuf).forEach(k =>
  encodedProtobuf[k] = encodeProtobuf(k));
// encode objects into Buffers
const encodedProtobufBuffers = encodeProtobufBuffers();

const encodedMsgPackBuffers = encodeMsgpack();

function encodeMsgpack() {
  const events = [];
  for(const event of mergeEventObjects) {
    events.push(msgpack.encode(event));
  }
  return events;
}

function encodeProtobuf(encoding) {
  const events = [];
  for(const event of mergeEventObjects) {
    const message = ContinuityMessage.create(event);
    events.push(ContinuityMessage.encode(message).finish().toString(encoding));
  }
  return events;
}

function encodeProtobufBuffers() {
  const events = [];
  for(const event of mergeEventObjects) {
    const message = ContinuityMessage.create(event);
    events.push(ContinuityMessage.encode(message).finish());
  }
  return events;
}

// decode string encoded Protobuf
function decodeProtobuf(encoding) {
  const events = [];
  for(const event of encodedProtobuf[encoding]) {
    events.push(ContinuityMessage.toObject(
      ContinuityMessage.decode(Buffer.from(event, encoding))));
  }
}

// decode Buffers
function decodeProtobufBuffers() {
  const events = [];
  for(const event of encodedProtobufBuffers) {
    events.push(ContinuityMessage.toObject(ContinuityMessage.decode(event)));
  }
}

function decodeMsgPackBuffers() {
  const events = [];
  for(const event of encodedMsgPackBuffers) {
    events.push(msgpack.decode(event));
  }
}

function decodeJson() {
  const events = [];
  for(const event of mergeEventStrings) {
    events.push(JSON.parse(event));
  }
}

function _parse({events}) {
  const result = [];
  for(const event of events) {
    result.push(JSON.parse(event));
  }
  return result;
}

console.log('--------------------------------------------------------');
console.log(`Each op is processing ${mergeEventStrings.length} items.`);
console.log('--------------------------------------------------------');

suite
  .add('encode JSON.stringify', () => encodeJson())
  .add('encode Msgpack', () => encodeMsgpack())
  .add('encode Protobuf to Buffer', () => encodeProtobufBuffers())
  .add('encode Protobuf binary encoded string', () => encodeProtobuf('binary'))
  .add('encode Protobuf base64 encoded string', () => encodeProtobuf('base64'))
  .add('encode Protobuf hex encoded string', () => encodeProtobuf('hex'))
  .add('decode JSON.parse', () => decodeJson())
  .add('decode msgPack', () => decodeMsgPackBuffers())
  .add('decode Protobuf Buffers', () => decodeProtobufBuffers())
  .add('decode Protobuf binary encoded string', () => decodeProtobuf('binary'))
  .add('decode Protobuf binary encoded string', () => decodeProtobuf('base64'))
  .add('decode Protobuf binary encoded string', () => decodeProtobuf('hex'))
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
