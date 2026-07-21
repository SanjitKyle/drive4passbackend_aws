const mongoose = require('mongoose');
require('dotenv').config();

const connectMongoDb = async () => {

	try {		
		await mongoose.connect(process.env.MONGODB_URL);
		console.log('MongoDB Connected Successfully');
		
		// Synchronize indexes to drop any obsolete unique index on package_master
		const PackageMaster = require('../models/DS/package_master.model.js');
		await PackageMaster.syncIndexes();
		console.log('PackageMaster indexes synchronized.');
	}
	catch(error){
		console.log('MongoDB Connection Error => ', error);
		process.exit(1);
	}	
}

module.exports = connectMongoDb;
