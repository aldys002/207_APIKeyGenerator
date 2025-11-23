const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const User = require("../models/User");
const ApiKey = require("../models/ApiKey");

// CREATE USER (public)
router.post("/create", userController.createUser);

// GET ALL USERS (admin only) — PERTAHANKAN
router.get("/", auth, userController.getUsers);

// DELETE USER (admin only) — PERTAHANKAN
router.delete("/:id", auth, userController.deleteUser);

// ======================
// CUSTOM POST /
// ======================
router.post("/", async (req, res) => {
  try {
    console.log("📩 BODY DITERIMA DARI FRONTEND:", req.body);

    const { firstname, lastname, email } = req.body;

    const emailExist = await User.findOne({ where: { email } });
    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar!"
      });
    }

    const user = await User.create({ firstname, lastname, email });

    return res.status(201).json({
      success: true,
      message: "User berhasil dibuat",
      user
    });

  } catch (err) {
    console.log("🔥 ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// ======================
// FIX DUPLIKASI GET /
// ======================
router.get("/all", auth, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================
// FIX DUPLIKASI DELETE
// ======================
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;

    // hapus semua apikey milik user dulu ⇒ FIX foreign key error
    await ApiKey.destroy({ where: { user_id: userId } });

    const deleted = await User.destroy({ where: { id: userId } });

    if (!deleted) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.json({ message: "User deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
