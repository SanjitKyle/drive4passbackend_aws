const mongoose = require('mongoose');

const postcodeSchema = new mongoose.Schema({
    postcode: String,
    county: String,
    district: String,
    ward: String,
    country: String,
    latitude: Number,
    longitude: Number
});

module.exports = mongoose.model('Postcode', postcodeSchema);