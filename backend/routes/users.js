const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

router.post("/complete-profile", protect, userController.CompleteProfile);

module.exports = router;
