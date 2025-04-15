const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Save files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

// Database connection
const db = mysql.createConnection({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Registration Route
router.post('/', upload.single('photo'), async (req, res) => {
  const {
    first_name,
    last_name,
    email_id,
    phone_no,
    nid_no,
    address,
    password,
    retypepassword,
  } = req.body;

  if (password !== retypepassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const photoPath = req.file ? req.file.filename : null;

    const query = `
      INSERT INTO register_userinfo 
      (first_name, last_name, email_id, phone_no, nid_no, password, address, userimage) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      first_name,
      last_name,
      email_id,
      phone_no,
      nid_no,
      hashedPassword,
      address,
      photoPath,
    ];

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
