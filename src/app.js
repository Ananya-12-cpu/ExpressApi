const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const authenticateToken = require("./middleware/authMiddleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
require("./models/associations");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Attach token check middleware globally except for login and register
app.use((req, res, next) => {
  // Allow login and register without token
  if (
    (req.path === "/api/auth/login" || req.path === "/api/auth/register") &&
    req.method === "POST"
  ) {
    return next();
  }
  // For all other /api routes, require token
  if (req.path.startsWith("/api/")) {
    return authenticateToken(req, res, next);
  }
  next();
});

// Routes
app.use("/api/todos", todoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Database sync and server start
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.sync();
    console.log("Database connected with model successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
