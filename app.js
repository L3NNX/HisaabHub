const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const session = require('express-session');
// const userModel = require('./models/userModel');

// Import the routes
const fileRoutes = require('./routes/fileRoutes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Session configuration
app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

// Use the routes
app.use('/', fileRoutes);


app.listen(process.env.PORT, () => {
    log(`Listening at port ${process.env.PORT}`)
})