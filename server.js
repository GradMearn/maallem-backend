const mongoose = require("mongoose");
const app = require("./app");
const { PORT, MONGO_URI } = require("./src/config/env");

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
      console.log(`📄 OpenAPI JSON: http://localhost:${PORT}/api-docs.json`);
      console.log(`❤️  Health check: http://localhost:${PORT}/health`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `❌ Port ${PORT} is already in use. Stop the old server first:\n` +
            `   netstat -ano | findstr :${PORT}\n` +
            `   taskkill /PID <PID> /F`,
        );
      } else {
        console.error("❌ Server error:", err.message);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});

startServer();