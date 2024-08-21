const mongoose = require("mongoose")

// mongoose.connect('mongodb+srv://Khaatabook:1234@khaatabook.dokzs.mongodb.net/?retryWrites=true&w=majority&appName=Khaatabook')
mongoose.connect('mongodb+srv://Khaatabook:1234@khaatabook.dokzs.mongodb.net/khaatabook')
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("userModel", userSchema)