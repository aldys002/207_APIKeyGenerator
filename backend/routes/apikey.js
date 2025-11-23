const express = require("express");
const router = express.Router();
const apiKeyController = require("../controllers/apiKeyController");
const auth = require("../middleware/auth");

router.post("/generate", apiKeyController.generateApiKey);
router.get("/all", auth, apiKeyController.getAllApiKeys);
router.delete("/:id", auth, apiKeyController.deleteApiKey);

module.exports = router;
