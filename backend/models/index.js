const db = require("../config/database");
const Admin = require("./Admin");
const User = require("./User");
const ApiKey = require("./ApiKey");

// ===== RELASI =====
// ApiKey punya user_id (optional)
ApiKey.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(ApiKey, { foreignKey: "user_id" });

module.exports = { db, Admin, User, ApiKey };
