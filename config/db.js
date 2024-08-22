const mongoose = require("mongoose");
require('dotenv').config(); 

const connectDB = async () => {
    try {
        console.log('MongoDB URI:', "mongodb+srv://Khaatabook:1234@khaatabook.dokzs.mongodb.net/?retryWrites=true&w=majority&appName=Khaatabook");
        await mongoose.connect(process.env.MONGODB_URI); // Removed deprecated options
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
