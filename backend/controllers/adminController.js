const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "STATIC_SECRET_JWT_123456";

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ email, password: hashed });

  res.json({ message: "Admin created", admin });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ where: { email } });
  if (!admin) return res.status(404).json({ error: "Admin not found" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: "1d" });

  res.json({ message: "Login success", token });
};
