const express = require("express");
const multer = require("multer");
const router = express.Router();
const authenticateToken = require("../middleware/authenticatetoken");
const mysql = require("mysql2");

const db = mysql.createConnection({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // Set upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique file name
  },
});

const upload = multer({ storage });

// Get User Profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `authenticateToken` adds `req.user`
    const [user] = await db.query(
      "SELECT * FROM register_userinfo WHERE id = ?",
      [userId]
    );

    if (user.length > 0) {
      res.json({
        ...user[0],
        userimage: user[0].userimage
          ? `${process.env.BASE_URL}/uploads/${user[0].userimage}` // Adjust file path
          : null,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update User Profile Image
router.post(
  "/profile-image",
  authenticateToken,
  upload.single("userimage"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const filePath = req.file.filename;

      await db.query("UPDATE register_userinfo SET userimage = ? WHERE id = ?", [
        filePath,
        userId,
      ]);
      res.json({ message: "Profile image updated successfully!" });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
