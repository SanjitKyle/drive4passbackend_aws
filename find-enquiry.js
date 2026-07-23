require('dotenv').config();
const mongoose = require('mongoose');
const Enquire = require('./src/models/DS/enquires.model');

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to DB.");

    // Find if sanjitpal132@gmail.com exists exactly
    const exactMatch = await Enquire.find({ email: "sanjitpal132@gmail.com" });
    console.log("Exact match for sanjitpal132@gmail.com:", exactMatch.map(e => ({ id: e._id, email: e.email, name: e.name })));

    // Find last 5 enquiries to see what emails are actually in the DB
    const recent = await Enquire.find().sort({ createdAt: -1 }).limit(5);
    console.log("Recent 5 Enquiries:", recent.map(e => ({ id: e._id, email: e.email, name: e.name })));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDB();
