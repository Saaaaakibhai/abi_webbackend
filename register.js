const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const router = express.Router();

// Database connection
const db = mysql.createConnection({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Registration Route
router.post('/', async (req, res) => {
  const { first_name, last_name, email_id, phone_no, nid_no, address, password, retypepassword } = req.body;

  // Ensure that the password and retypepassword match before continuing
  if (password !== retypepassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const query = `
      INSERT INTO register_userinfo 
      (first_name, last_name, email_id, phone_no, nid_no, password, address, retypepassword) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [first_name, last_name, email_id, phone_no, nid_no, hashedPassword, address, hashedPassword];

    db.execute(query, values, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving user', error: err });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
});

module.exports = router;
