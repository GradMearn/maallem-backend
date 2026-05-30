const authService = require("./auth.service");
const catchAsync = require("../../utils/catchAsync");
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} = require("./auth.validation");

// ─── Helper ───────────────────────────────────────────────────────────────────

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

// ─── Controllers ─────────────────────────────────────────────────────────────

const register = catchAsync(async (req, res) => {
  const data = validate(registerSchema, req.body);
  const { user, accessToken, refreshToken } = await authService.register(data);

  res.status(201).json({
    success: true,
    message: "Registered successfully",
    data: { user, accessToken, refreshToken },
  });
});

const login = catchAsync(async (req, res) => {
  const data = validate(loginSchema, req.body);
  const { user, accessToken, refreshToken } = await authService.login(data);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: { user, accessToken, refreshToken },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = validate(refreshTokenSchema, req.body);
  const { accessToken, user } =
    await authService.refreshAccessToken(refreshToken);

  res.status(200).json({
    success: true,
    message: "Token refreshed",
    data: { accessToken, user },
  });
});

const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  await authService.logout(req.user.id, refreshToken);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

const logoutAll = catchAsync(async (req, res) => {
  await authService.logoutAll(req.user.id);

  res.status(200).json({
    success: true,
    message: "Logged out from all devices",
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

module.exports = { register, login, refreshToken, logout, logoutAll, getMe };
