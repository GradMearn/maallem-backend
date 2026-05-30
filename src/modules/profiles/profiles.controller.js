const catchAsync = require("../../utils/catchAsync");
const profilesService = require("./profiles.service");
const {
  workerProfileSchema,
  companyProfileSchema,
} = require("./profiles.validation");

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message);
    const err = new Error(messages.join(", "));
    err.statusCode = 422;
    throw err;
  }
  return value;
};

// ─── Public: Workers ──────────────────────────────────────────────────────────

const listWorkers = catchAsync(async (req, res) => {
  const profiles = await profilesService.listWorkers(req.query);
  res.status(200).json({
    success: true,
    count: profiles.length,
    data: { profiles },
  });
});

const getWorker = catchAsync(async (req, res) => {
  const profile = await profilesService.getWorkerById(req.params.id);
  res.status(200).json({ success: true, data: { profile } });
});

// ─── Public: Companies ────────────────────────────────────────────────────────

const listCompanies = catchAsync(async (req, res) => {
  const profiles = await profilesService.listCompanies(req.query);
  res.status(200).json({
    success: true,
    count: profiles.length,
    data: { profiles },
  });
});

const getCompany = catchAsync(async (req, res) => {
  const profile = await profilesService.getCompanyById(req.params.id);
  res.status(200).json({ success: true, data: { profile } });
});

// ─── Protected: Worker own profile ───────────────────────────────────────────

const createWorkerProfile = catchAsync(async (req, res) => {
  const profile = await profilesService.createWorkerProfile(
    req.user.id,
    req.body,
    req.files,
  );
  res.status(201).json({
    success: true,
    message: "Worker profile created",
    data: { profile },
  });
});

const updateWorkerProfile = catchAsync(async (req, res) => {
  if (Object.keys(req.body).length) {
    validate(workerProfileSchema, req.body);
  }
  const profile = await profilesService.updateWorkerProfile(
    req.user.id,
    req.body,
    req.files,
  );
  res.status(200).json({
    success: true,
    message: "Worker profile updated",
    data: { profile },
  });
});

const deleteWorkerProfile = catchAsync(async (req, res) => {
  await profilesService.deleteWorkerProfile(req.user.id);
  res.status(200).json({
    success: true,
    message: "Worker profile deleted",
  });
});

const getMyWorkerProfile = catchAsync(async (req, res) => {
  const profile = await profilesService.getProfileByUser(req.user.id, "worker");
  if (!profile) {
    const err = new Error("Worker profile not found");
    err.statusCode = 404;
    throw err;
  }
  res.status(200).json({ success: true, data: { profile } });
});

// ─── Protected: Company own profile ──────────────────────────────────────────

const createCompanyProfile = catchAsync(async (req, res) => {
  const profile = await profilesService.createCompanyProfile(
    req.user.id,
    req.body,
    req.files,
  );
  res.status(201).json({
    success: true,
    message: "Company profile created",
    data: { profile },
  });
});

const updateCompanyProfile = catchAsync(async (req, res) => {
  if (Object.keys(req.body).length) {
    validate(companyProfileSchema, req.body);
  }
  const profile = await profilesService.updateCompanyProfile(
    req.user.id,
    req.body,
    req.files,
  );
  res.status(200).json({
    success: true,
    message: "Company profile updated",
    data: { profile },
  });
});

const deleteCompanyProfile = catchAsync(async (req, res) => {
  await profilesService.deleteCompanyProfile(req.user.id);
  res.status(200).json({
    success: true,
    message: "Company profile deleted",
  });
});

const getMyCompanyProfile = catchAsync(async (req, res) => {
  const profile = await profilesService.getProfileByUser(
    req.user.id,
    "company",
  );
  if (!profile) {
    const err = new Error("Company profile not found");
    err.statusCode = 404;
    throw err;
  }
  res.status(200).json({ success: true, data: { profile } });
});

module.exports = {
  listWorkers,
  getWorker,
  listCompanies,
  getCompany,
  createWorkerProfile,
  updateWorkerProfile,
  deleteWorkerProfile,
  getMyWorkerProfile,
  createCompanyProfile,
  updateCompanyProfile,
  deleteCompanyProfile,
  getMyCompanyProfile,
};
