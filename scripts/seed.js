// scripts/seed.js
// CommonJS script so you can run: node scripts/seed.js
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/livemart';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, index: true },
  phone: String,
  role: { type: String, enum: ['CUSTOMER','RETAILER','WHOLESALER'], default: 'CUSTOMER' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0,0] } // [lng, lat]
  }
}, { timestamps: true });

async function run() {
  try {
    console.log('Connecting to', uri);
    await mongoose.connect(uri, { dbName: 'livemart' });
    console.log('Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // remove previously seeded users to avoid duplicates
    await User.deleteMany({ email: /@seed.local$/ });

    const users = [
      { name: "Retailer Mumbai A", email: "retailer-a@seed.local", phone: "9000000001", role: "RETAILER", location: { type: "Point", coordinates: [72.8777, 19.0760] } },
      { name: "Retailer Mumbai B", email: "retailer-b@seed.local", phone: "9000000002", role: "RETAILER", location: { type: "Point", coordinates: [72.8850, 19.1010] } },
      { name: "Retailer Pune", email: "retailer-pune@seed.local", phone: "9000000003", role: "RETAILER", location: { type: "Point", coordinates: [73.8567, 18.5204] } }
    ];

    const inserted = await User.insertMany(users);
    console.log('Seeded users:', inserted.map(u => u.email));
    // ensure 2dsphere index exists
    await User.collection.createIndex({ location: '2dsphere' });
    console.log('Ensured 2dsphere index on users.location');

    await mongoose.disconnect();
    console.log('Done. Disconnected.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

run();
