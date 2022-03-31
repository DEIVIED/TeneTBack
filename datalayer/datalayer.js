const mongoose = require('mongoose');
const urlMongod = "mongodb://localhost:27017/db";
require('dotenv').config()


// const DB_URI = process.env.MONGODB_URI_CLUSTER || 'mongodb+srv://deivied:toto@cluster0.uctov.mongodb.net/db?';
const DB_URI = process.env.MONGODB_URI_CLUSTER0 || process.env.MONGODB_URI_CLUSTER1
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const connectionDB = async () => {
    try {
        await mongoose.connect(DB_URI, mongooseOptions);
        console.log("Successfully connected to the database");
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    connectionDB,
}