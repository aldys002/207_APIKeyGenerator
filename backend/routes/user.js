const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// CREATE USER (public)
router.post("/create", userController.createUser);

// GET ALL USERS (admin only)
router.get("/", auth, userController.getUsers);

// DELETE USER (admin only)
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
