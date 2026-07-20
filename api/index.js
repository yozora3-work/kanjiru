import express from "express";
import process from "node:process";

const app = express();

// Middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    status: "success",
    message: "API is working!",
    timestamp: new Date().toISOString(),
  });
});

// Your routes (without database for now)
app.post("/api/cards", (req, res) => {
  console.log("POST /api/cards received:", req.body);
  res.json({
    status: "success",
    data: req.body,
    message: "Card created (no DB)",
  });
});

app.get("/api/cards/:id", (req, res) => {
  console.log("GET /api/cards/:id", req.params.id);
  res.json({
    status: "success",
    data: { id: req.params.id },
    message: "Card found (no DB)",
  });
});

app.put("/api/cards", (req, res) => {
  res.json({
    status: "success",
    data: req.body,
    message: "Card updated (no DB)",
  });
});

app.patch("/api/cards/:id", (req, res) => {
  res.json({
    status: "success",
    data: { id: req.params.id, ...req.body },
    message: "Card patched (no DB)",
  });
});

app.delete("/api/cards/:id", (req, res) => {
  res.json({
    status: "success",
    data: { id: req.params.id },
    message: "Card deleted (no DB)",
  });
});

// Debug endpoint to check database
app.get("/api/debug/db", (req, res) => {
  res.json({
    status: "success",
    message: "Debug endpoint working",
    cwd: process.cwd(),
    nodeVersion: process.version,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.url} not found`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

export default app;
