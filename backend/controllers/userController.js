const User = require("../models/User");
const ApiKey = require("../models/ApiKey");

module.exports = {
  createUser: async (req, res) => {
  try {
    // 🔥 DEBUG LOG — CEK APA YANG MASUK DARI FRONTEND
    console.log("📩 BODY DITERIMA DARI FRONTEND:", req.body);

    const { firstname, lastname, email, apikey } = req.body;

    // validasi input
    if (!firstname || !lastname || !email) {
      console.log("❌ FIELD KOSONG");
      return res.status(400).json({ error: "All fields are required" });
    }

    // cek email sudah ada
    const exist = await User.findOne({ where: { email } });
    if (exist) {
      console.log("❌ EMAIL SUDAH ADA:", email);
      return res.status(400).json({ error: "Email already exists" });
    }

    // buat user
    const user = await User.create({
      firstname,
      lastname,
      email,
      created_at: new Date(),
      updated_at: new Date()
    });

    console.log("✅ USER CREATED:", user.id);

    // update API key jika ada
    if (apikey) {
      console.log("🔑 APIKEY YANG DIKIRIM:", apikey);

      const keyRecord = await ApiKey.findOne({ where: { key: apikey } });

      if (!keyRecord) console.log("❌ APIKEY TIDAK DITEMUKAN");

      if (keyRecord) {
        console.log("🔄 UPDATE APIKEY:", keyRecord.id);

        await keyRecord.update({
          status: true,
          user_id: user.id,
          updated_at: new Date()
        });
      }
    }

    res.status(200).json({ message: "User created & API key activated!", user });
  } catch (err) {
    console.error("🔥 ERROR createUser:", err);
    res.status(500).json({ error: err.message });
  }
},

  getUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await User.destroy({ where: { id } });
      if (!deleted) return res.status(404).json({ error: "User not found" });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
};
