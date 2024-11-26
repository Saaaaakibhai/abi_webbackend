const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Login route
router.post('/', (req, res) => { // Ensure this matches the frontend endpoint
  const { phone, password } = req.body;

  const query = 'SELECT * FROM register_userinfo WHERE phone_no = ?';
  db.execute(query, [phone], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful', user: { phone: user.phone_no } });
  });
});

module.exports = router;
