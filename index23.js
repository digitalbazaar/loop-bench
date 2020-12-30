const _ = require('lodash');
const jsonld = require('jsonld');
const mergeEvent = require('./continuity-merge-event.json');
const {contexts} = require('web-ledger-context');
const quadsMergeEvent = require('./quads-merge-event.json');
const rdfCanonize = require('rdf-canonize');
const rdfCanonizeRust =
  require('../rust-node-bindgen-canonize/dist/index.node');
const assert = require('assert');

async function documentLoader(url) {
  if(contexts.has(url)) {
    return {
      contextUrl: null,
      document: contexts.get(url),
      documentUrl: url
    };
  }
}

(async () => {
  // const y = await jsonld.toRDF(mergeEvent.event, {
  //   format: 'application/n-quads',
  //   documentLoader
  // });
  /* eslint-disable max-len */
  const y = `_:b0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/webledger#ContinuityMergeEvent> .
_:b0 <https://w3id.org/security#proof> _:b1 .
_:b0 <https://w3id.org/webledger#parentHash> "67erx8opxkhZsdjbFpz5m2Y44ijaNwYDxcGHKtp1KiQk" .
_:b0 <https://w3id.org/webledger#parentHash> "6JHVtzSUZA7bJLwtKuoNjbbqX8v8iThy1yTU7NHJmffG" .
_:b0 <https://w3id.org/webledger#parentHash> "7BmerSqDfRvySS1AYzHEj24fsrjvuovC7qMeSPwSu7ZZ" .
_:b0 <https://w3id.org/webledger#parentHash> "7WnEYh9To4PEXB9U6aoGHmdmZXWTe3XTisXSj6kMpSR5" .
_:b0 <https://w3id.org/webledger#parentHash> "7zRgrrxhxbZ1dWD9Rd1TSdZHUiJ1t6UEjxS7Bc9FNSAM" .
_:b0 <https://w3id.org/webledger#parentHash> "81Gxxs2ZmUGnf5KM21iqQzzGRiVvu8FPhg4EEF5Sk4aB" .
_:b0 <https://w3id.org/webledger#parentHash> "AiFNk992etN3uSXdH9d3CiQwPG29PPUrLUmR3ZJDq11R" .
_:b0 <https://w3id.org/webledger#parentHash> "AyQV4tM8ch4NQu6kTZ48qtez5ZZfGdjVn5VMRPbWhfPr" .
_:b0 <https://w3id.org/webledger#parentHash> "AzivxjztiRspQ9i7v8UgEGsZCrex51fjseYnpXvWiMDb" .
_:b0 <https://w3id.org/webledger#parentHash> "DcZrwAoNm5zQZ3SsxgVF8ZrecAu4HwsPQqKkhhexSVb6" .
_:b0 <https://w3id.org/webledger#parentHash> "FV9ZZp89GRGi3aPHvikqqXa1JM2if83Q39UrKkUveqBX" .
_:b0 <https://w3id.org/webledger#parentHash> "Ge7qDheGToDqgYtDTiNXWf2zJfTLr6i8itwDakg4ubD3" .
_:b0 <https://w3id.org/webledger#parentHash> "Mbv1iJmwrM2diDxjrtrW8BxfpwFtprjFF8HJGvNumvy" .
_:b0 <https://w3id.org/webledger#treeHash> "3RTwPo9MUk2s3vb1WdUD2P9zvQ8Le6bajqwBGVFg2BHr" .
_:b2 <http://purl.org/dc/terms/created> "2020-12-29T21:12:26.269Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> _:b1 .
_:b2 <http://purl.org/dc/terms/creator> <https://bedrock.localhost:18443/consensus/continuity2017/voters/z6MkkabTusFkLnquxwHwCm28v59UX3P9Pn5scvc7fCaNvWUL> _:b1 .
_:b2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/security#Ed25519Signature2018> _:b1 .
_:b2 <https://w3id.org/security#jws> "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..JJ5c7mF7ru9XhPtrNqj1s6J74yqOC0HcNyK_Wa0OcfDaiODZFIJ2dXIrc_qqqvTWynIqJid6yXkKsGAzyi_HDQ" _:b1 .
`;
  console.log('YYYYYYYY', y);
  const t = rdfCanonize.NQuads.parse(y);
  console.log('TTTTTTTTTT', JSON.stringify(t, null, 2));

  const options = {
    algorithm: 'URDNA2015',
    inputFormat: 'application/n-quads',
    format: 'application/n-quads'
  };

  // MUST clone because JS mutates t
  const rustInput = _.cloneDeep(t);
  const jsResult = await rdfCanonize.canonize(t, options);
  const rustResult = rdfCanonizeRust.canonize(rustInput, options);
  console.log('JS -------');
  console.log(jsResult);
  console.log('Rust -----');
  console.log((rustResult));
  // assert equality for merge event js vs rust
  assert.strictEqual(jsResult, rustResult);
  console.log('Assertion Passed');
})().catch(console.error);

