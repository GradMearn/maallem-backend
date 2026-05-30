const express = require("express");
const router = express.Router();
const profilesController = require("./profiles.controller");
const { protect, authorize } = require("../auth/auth.middleware");
const { workerUpload, companyUpload } = require("../../middlewares/upload");

// ─── Public (no auth) ─────────────────────────────────────────────────────────
router.get("/workers", profilesController.listWorkers);
router.get("/workers/:id", profilesController.getWorker);
router.get("/companies", profilesController.listCompanies);
router.get("/companies/:id", profilesController.getCompany);

// ─── Worker profile (auth required) ─────────────────────────────────────────
router.post(
  "/worker/me",
  protect,
  authorize("worker"),
  workerUpload,
  profilesController.createWorkerProfile,
);
router.get(
  "/worker/me",
  protect,
  authorize("worker"),
  profilesController.getMyWorkerProfile,
);
router.put(
  "/worker/me",
  protect,
  authorize("worker"),
  workerUpload,
  profilesController.updateWorkerProfile,
);
router.patch(
  "/worker/me",
  protect,
  authorize("worker"),
  workerUpload,
  profilesController.updateWorkerProfile,
);
router.delete(
  "/worker/me",
  protect,
  authorize("worker"),
  profilesController.deleteWorkerProfile,
);

// ─── Company profile (auth required) ─────────────────────────────────────────
router.post(
  "/company/me",
  protect,
  authorize("company"),
  companyUpload,
  profilesController.createCompanyProfile,
);
router.get(
  "/company/me",
  protect,
  authorize("company"),
  profilesController.getMyCompanyProfile,
);
router.put(
  "/company/me",
  protect,
  authorize("company"),
  companyUpload,
  profilesController.updateCompanyProfile,
);
router.patch(
  "/company/me",
  protect,
  authorize("company"),
  companyUpload,
  profilesController.updateCompanyProfile,
);
router.delete(
  "/company/me",
  protect,
  authorize("company"),
  profilesController.deleteCompanyProfile,
);

module.exports = router;
