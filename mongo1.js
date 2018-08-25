const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server
MongoClient.connect(url, async (err, client) => {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  const collection = await db.createCollection('foo');
  try {
    await collection.insertOne({id: 'myId', 'some.dot.notation': true}, err => {
      console.log('AAAAAAAAAA', err);
    });
  } catch(e) {
    console.error('EEEEEEEEEE', e);
  }

  client.close();
});
