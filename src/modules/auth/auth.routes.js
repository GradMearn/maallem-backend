const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { protect } = require("./auth.middleware");

// ─── Public Routes ────────────────────────────────────────────────────────────
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);

// ─── Protected Routes ─────────────────────────────────────────────────────────
router.use(protect); // كل اللي بعده محتاج token

router.get("/me", authController.getMe);
router.post("/logout", authController.logout);
router.post("/logout-all", authController.logoutAll);

module.exports = router;