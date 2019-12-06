## current result with node v8.11.3
```
you@yourmachine:~/dev/loop-bench$ node index2.js
sha256 x 35.47 ops/sec ±2.39% (60 runs sampled)
xor x 3.60 ops/sec ±2.14% (14 runs sampled)
Fastest is sha256
```

# index4.js encode/decode javascript objects
Protobuf requires a [schema](./continuity-event.json).
```
20180827

you@yourmachine:~/dev/loop-bench$ node --version
v10.9.0

--------------------------------------------------------
Each op is processing 9605 items.
--------------------------------------------------------
encode JSON.stringify x 20.09 ops/sec ±1.77% (37 runs sampled)
encode Msgpack x 2.82 ops/sec ±3.13% (11 runs sampled)
encode Protobuf to Buffer x 23.15 ops/sec ±3.21% (42 runs sampled)
encode Protobuf binary encoded string x 20.60 ops/sec ±2.69% (38 runs sampled)
encode Protobuf base64 encoded string x 17.84 ops/sec ±3.37% (47 runs sampled)
encode Protobuf hex encoded string x 15.87 ops/sec ±2.67% (42 runs sampled)
decode JSON.parse x 7.89 ops/sec ±1.45% (24 runs sampled)
decode msgPack x 4.14 ops/sec ±1.76% (15 runs sampled)
decode Protobuf Buffers x 41.22 ops/sec ±3.54% (54 runs sampled)
decode Protobuf binary encoded string x 34.04 ops/sec ±4.64% (59 runs sampled)
decode Protobuf binary encoded string x 23.99 ops/sec ±3.00% (43 runs sampled)
decode Protobuf binary encoded string x 25.18 ops/sec ±2.41% (44 runs sampled)
Fastest is decode Protobuf Buffers
```

# index6.js canonicalize vs json.canonize
```
node --version
v10.9.0

canonicalize x 110,961 ops/sec ±0.75% (92 runs sampled)
normalize x 1,394 ops/sec ±6.65% (64 runs sampled)
Fastest is canonicalize
```

# index8.js string.length vs Buffer.byteLength
```
node --version
v10.14.2

string.length x 17,822 ops/sec ±1.08% (85 runs sampled)
buffer.byteLength x 482 ops/sec ±0.32% (90 runs sampled)
Fastest is string.length
```
# index22.js benchmark veres one did doc generation
```
node --version
v10.15.1

generate did:v1 document x 2,850 ops/sec ±3.52% (75 runs sampled)
Fastest is generate did:v1 document

================================================================================

Hardware Overview:
  Model Name:	MacBook Pro
  Model Identifier:	MacBookPro12,1
  Processor Name:	Intel Core i5
  Processor Speed:	2.9 GHz
  Number of Processors:	1
  Total Number of Cores:	2
  L2 Cache (per Core):	256 KB
  L3 Cache:	3 MB
  Hyper-Threading Technology:	Enabled
  Memory:	16 GB
```

# index23.js benchmark veres one did doc generation
```
node --version
v12.13.0

generate did document x 887 ops/sec ±6.96% (67 runs sampled)
generate did document and gather endpoints x 520 ops/sec ±101.30% (72 runs sampled)
generate did document, gather endpoints, and send did document x 13.35 ops/sec ±7.72% (55 runs sampled)
generate did document and send did document w/ did-veres-one x 14.46 ops/sec ±5.40% (46 runs sampled)
Fastest is generate did document
```
