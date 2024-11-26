const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/login', (req, res) => {
  const { phone, password } = req.body;

  const query = 'SELECT * FROM register_userinfo WHERE phone_no = ?';
  db.execute(query, [phone], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: 'User not found' });
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
