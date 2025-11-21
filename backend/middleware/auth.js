const jwt = require("jsonwebtoken");

const JWT_SECRET = "STATIC_SECRET_JWT_123456"; // bebas, yang penting kuat & tidak mudah ditebak

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Unauthorized" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
