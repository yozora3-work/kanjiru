import { createRequire } from "module";
import path from "path";
import process from "node:process";
import fs from "fs";
import express from "express";
import cors from "cors";
import helmet from "helmet";

const require = createRequire(import.meta.url);
const sqlite3 = require("sqlite3").verbose();

// Import your app routes from the original app.js
// But we'll recreate the routes here to avoid issues
const app = express();

// ✅ CORS middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.options("*", cors());

// ✅ Other middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Database connection function (not a single connection)
const getDb = () => {
  try {
    // For Vercel, use /tmp directory
    const dbPath = process.env.VERCEL
      ? "/tmp/dbtest.db"
      : path.join(process.cwd(), "dbtest.db");

    console.log("Database path:", dbPath);
    console.log("Database exists?", fs.existsSync(dbPath));

    // If in Vercel and database doesn't exist in /tmp, copy from project
    if (process.env.VERCEL && !fs.existsSync(dbPath)) {
      const sourcePath = path.join(process.cwd(), "dbtest.db");
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, dbPath);
        console.log("✅ Database copied from project to /tmp");
      } else {
        console.warn("⚠️ Source database not found, creating new one");
      }
    }

    // Open database in read/write mode for Vercel
    const db = new sqlite3.Database(
      dbPath,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) {
          console.error("❌ Database error:", err.message);
        } else {
          console.log("✅ Connected to database");
        }
      },
    );

    return db;
  } catch (error) {
    console.error("❌ Database connection error:", error);
    throw error;
  }
};

// ✅ Debug endpoint
app.get("/api/debug/db", async (req, res) => {
  try {
    console.log("=== Debug Database ===");
    console.log("Current directory:", process.cwd());

    // Check files in current directory
    let files = [];
    try {
      files = fs.readdirSync(".");
    } catch (e) {
      console.error("Cannot read directory:", e);
    }

    // Check if database exists in various paths
    const dbPaths = [
      "dbtest.db",
      "/tmp/dbtest.db",
      path.join(process.cwd(), "dbtest.db"),
    ];

    const results = {};
    for (const dbPath of dbPaths) {
      try {
        results[dbPath] = fs.existsSync(dbPath);
      } catch (e) {
        results[dbPath] = false;
      }
    }

    res.status(200).json({
      status: "success",
      cwd: process.cwd(),
      files: files,
      databaseExists: results,
      nodeVersion: process.version,
      isVercel: !!process.env.VERCEL,
    });
  } catch (err) {
    console.error("Debug error:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// ✅ Your API routes
// POST /api/cards
app.post("/api/cards", async (req, res, next) => {
  try {
    console.log("POST /api/cards received:", req.body);
    const db = getDb();

    // Your data functions here
    // const data = await getData(db, req.body);

    // For testing, just return the body
    res.status(200).json({
      status: "success",
      data: req.body,
      message: "Card created (test)",
    });

    db.close();
  } catch (err) {
    console.error("POST error:", err);
    err.statusCode = 404;
    next(err);
  }
});

// GET /api/cards/:id
app.get("/api/cards/:id", async (req, res, next) => {
  try {
    console.log("GET /api/cards/:id", req.params.id);
    const db = getDb();

    // Your data functions here
    // const data = await getData(db, { id: req.params.id });

    // For testing, just return the ID
    res.status(200).json({
      status: "success",
      data: { id: req.params.id, message: "Card found (test)" },
    });

    db.close();
  } catch (err) {
    console.error("GET error:", err);
    err.statusCode = 404;
    next(err);
  }
});

// PUT /api/cards
app.put("/api/cards", async (req, res, next) => {
  try {
    console.log("PUT /api/cards received:", req.body);
    const db = getDb();

    res.status(201).json({
      status: "success",
      data: req.body,
      message: "Card updated (test)",
    });

    db.close();
  } catch (err) {
    console.error("PUT error:", err);
    err.statusCode = 404;
    next(err);
  }
});

// PATCH /api/cards/:id
app.patch("/api/cards/:id", async (req, res, next) => {
  try {
    console.log("PATCH /api/cards/:id", req.params.id, req.body);
    const db = getDb();

    res.status(200).json({
      status: "success",
      data: { id: req.params.id, ...req.body },
      message: "Card patched (test)",
    });

    db.close();
  } catch (err) {
    console.error("PATCH error:", err);
    err.statusCode = 404;
    next(err);
  }
});

// DELETE /api/cards/:id
app.delete("/api/cards/:id", async (req, res, next) => {
  try {
    console.log("DELETE /api/cards/:id", req.params.id);
    const db = getDb();

    res.status(200).json({
      status: "success",
      data: { id: req.params.id },
      message: "Card deleted (test)",
    });

    db.close();
  } catch (err) {
    console.error("DELETE error:", err);
    err.statusCode = 404;
    next(err);
  }
});

// ✅ 404 handler
app.use((req, res) => {
  console.log("404:", req.method, req.url);
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on the server`,
  });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("Error handler:", err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// ✅ Export for Vercel (NO app.listen()!)
export default app;
