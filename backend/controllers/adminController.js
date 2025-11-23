const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {

    register: async (req, res) => {
        try {
            const { email, password } = req.body;

            const exist = await Admin.findOne({ where: { email } });
            if (exist) return res.status(400).json({ error: "Email already registered" });

            const hashed = await bcrypt.hash(password, 10);

            const admin = await Admin.create({
                email,
                password: hashed,
                created_at: new Date(),
                updated_at: new Date()
            });

            res.json({ message: "Admin registered successfully", admin });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    login: async (req, res) => {
        try {

            // ===== DEBUG LOG WAJIB =====
            console.log("====== LOGIN DEBUG START ======");
            console.log("REQ BODY =", req.body);

            const { email, password } = req.body;

            const admin = await Admin.findOne({ where: { email } });
            console.log("ADMIN FOUND =", admin);

            if (!admin) {
                console.log("ADMIN NOT FOUND");
                return res.status(404).json({ error: "Admin not found" });
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            console.log("PASSWORD MATCH =", isMatch);

            if (!isMatch) {
                console.log("INVALID PASSWORD");
                return res.status(400).json({ error: "Invalid password" });
            }

            const token = jwt.sign(
                { id: admin.id, email: admin.email },
                "STATIC_SECRET_JWT_123456",
                { expiresIn: "1d" }
            );

            console.log("TOKEN =", token);
            console.log("======= LOGIN DEBUG END =======");

            res.json({
                message: "Login successful",
                token,
                admin_id: admin.id
            });

        } catch (err) {
            console.log("LOGIN ERROR =", err);
            res.status(500).json({ error: err.message });
        }
    }
};
