import express from "express";
import { fileURLToPath } from "url";
import path from "path";

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";

// Define the port number
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * Configure EJS
 */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

/**
 * Configure Express Middleware
 */
app.use(express.static(path.join(__dirname, "public")));

/**
 * Routes
 */
app.get("/", async (req, res) => {
  res.render("home", {
    title: "Home",
  });
});

app.get("/organizations", async (req, res) => {
  res.render("organizations", {
    title: "Organizations",
  });
});

app.get("/projects", async (req, res) => {
  res.render("projects", {
    title: "Service Projects",
  });
});

app.get("/categories", async (req, res) => {
  res.render("categories", {
    title: "Service Project Categories",
  });
});

/**
 * Start Server
 */
const startServer = async () => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  });
};

startServer();
