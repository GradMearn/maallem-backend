const express = require("express");
const router = express.Router();
const authController = require("../../src/modules/auth/auth.controller");

// Auth Routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

module.exports = router;
