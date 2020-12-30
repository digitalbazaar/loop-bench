const fs = require('fs');
const readline = require('readline');
const rdfCanonize = require('rdf-canonize');

const readInterface = readline.createInterface({
  input: fs.createReadStream('./corpus.txt'),
  // output: process.stdout,
  console: false
});

(async () => {
  let lineCount = 0;
  let string = '';
  for await (const line of readInterface) {
    lineCount++;
    string += `${line}\n`;
    if(lineCount % 20 === 0) {
      const parsedInput = await rdfCanonize.NQuads.parse(string);
      // console.log('PPPPP', parsedInput);
      const result = await rdfCanonize.canonizeSync(parsedInput, {
        inputFormat: 'application/n-quads',
        algorithm: 'URDNA2015',
      });
      process.stdout.write(result);
      string = '';
    }
  }
})();

