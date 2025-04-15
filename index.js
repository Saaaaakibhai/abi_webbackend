// index.js
require('dotenv').config(); // Import dotenv at the top of the file
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const registerRoute = require('./register'); // import the register route
const loginRoute = require('./login');
const path = require('path');


//

const app = express();

const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173', // This is your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow the required methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow required headers
}));

// Middleware
app.use(bodyParser.json());
// Directly use the registration route here
app.use('/login', loginRoute);
app.use('/register', registerRoute); // Now the backend listens on /register
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create the database connection using environment variables
const db = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

app.get('/', (req, res) => {
    res.send('Congratulations, Amanot Business Invest server is running!');
});

app.listen(port, () => {
    console.log(`Amanat Business Invest Server Responding on port ${port}`);
});
