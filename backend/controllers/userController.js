const User = require("../models/User");

module.exports = {
    createUser: async (req, res) => {
        try {
            const { firstname, lastname, email } = req.body;

            const exist = await User.findOne({ where: { email } });
            if (exist) return res.status(400).json({ error: "Email already exists" });

            const user = await User.create({
                firstname,
                lastname,
                email,
                created_at: new Date(),
                updated_at: new Date()
            });

            res.json({ message: "User created successfully", user });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getUsers: async (req, res) => {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;

            const deleted = await User.destroy({ where: { id } });

            if (!deleted)
                return res.status(404).json({ error: "User not found" });

            res.json({ message: "User deleted successfully" });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
