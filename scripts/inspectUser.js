// scripts/inspectUsers.js
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb+srv://vamsi:vamsivamsi@livemartdb.pl9j4kc.mongodb.net';
const dbName = process.env.MONGODB_DB || 'livemart';

(async ()=>{
  await mongoose.connect(uri, { dbName });
  const u = await mongoose.connection.db.collection('users').findOne({ email: "debuguser@example.com" });
  console.log(JSON.stringify(u, null, 2));
  await mongoose.disconnect();
})();
