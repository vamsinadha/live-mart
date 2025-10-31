// scripts/checkUsers.js
// improved debug version - works with Atlas or local MongoDB
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB || 'livemart';

async function run() {
  console.log('Using URI:', uri);
  console.log('Using DB name:', dbName);

  // connect (explicit dbName option ensures we hit the intended DB on Atlas)
  await mongoose.connect(uri, { dbName, useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected. Listing databases available on this server/cluster...');

  // list databases to see where data actually exists
  try {
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('Databases on cluster:');
    dbs.databases.forEach(d => console.log('  -', d.name));
  } catch (e) {
    console.warn('Could not list databases (some providers restrict this):', e.message);
  }

  // now query the users collection in the chosen DB
  const users = await mongoose.connection.db.collection('users').find({ role: 'RETAILER' }).toArray();
  console.log('found:', users.length);
  console.dir(users, { depth: 2 });

  await mongoose.disconnect();
  console.log('Disconnected.');
}

run().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});
