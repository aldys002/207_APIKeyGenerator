const ApiKey = require("../models/ApiKey");
const User = require("../models/User");

// helper generate
function generateApiKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 40; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = {
    generate: async (req, res) => {
        try {
            const key = generateApiKey();
            const now = new Date();

            // out_date = 1 bulan
            const outDate = new Date();
            outDate.setMonth(outDate.getMonth() + 1);

            const newKey = await ApiKey.create({
                key,
                status: false,
                user_id: null,
                created_at: now,
                updated_at: now,
                out_date: outDate
            });

            res.json({
                message: "API Key generated",
                apikey: newKey
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const keys = await ApiKey.findAll();
            res.json(keys);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    assignToUser: async (req, res) => {
        try {
            const { apiKeyId, userId } = req.body;

            const apiKey = await ApiKey.findByPk(apiKeyId);
            if (!apiKey) return res.status(404).json({ error: "API key not found" });

            const user = await User.findByPk(userId);
            if (!user) return res.status(404).json({ error: "User not found" });

            await apiKey.update({
                user_id: userId,
                status: true,
                updated_at: new Date()
            });

            res.json({ message: "API Key assigned to user", apiKey });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const deleted = await ApiKey.destroy({
                where: { id }
            });

            if (!deleted) return res.status(404).json({ error: "API key not found" });

            res.json({ message: "API key deleted" });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
