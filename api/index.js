import express from "express";
import path from "path";
import fs from "fs";
import process from "process";

// Import SQLite
import sqlite3 from "sqlite3";

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

// Database helper
const getDb = () => {
  try {
    // Try to find database
    const paths = [
      "/tmp/dbtest.db",
      path.join(process.cwd(), "dbtest.db"),
      path.join(process.cwd(), "..", "dbtest.db"),
    ];

    let dbPath = paths.find((p) => fs.existsSync(p));

    // If no database found, create one in /tmp
    if (!dbPath) {
      dbPath = "/tmp/dbtest.db";
      console.log("Creating new database at:", dbPath);
    }

    console.log("Using database at:", dbPath);

    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Database error:", err.message);
      } else {
        console.log("Connected to database");
      }
    });

    return db;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

// Debug endpoint
app.get("/api/debug/db", (req, res) => {
  try {
    const dbPaths = [
      "dbtest.db",
      "/tmp/dbtest.db",
      path.join(process.cwd(), "dbtest.db"),
    ];

    const results = {};
    dbPaths.forEach((p) => {
      results[p] = fs.existsSync(p);
    });

    res.json({
      status: "success",
      cwd: process.cwd(),
      dbExists: results,
      files: fs.readdirSync(".").slice(0, 10),
      isVercel: !!process.env.VERCEL,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      stack: error.stack,
    });
  }
});

// Test endpoint with database
app.get("/api/test-db", (req, res) => {
  try {
    const db = getDb();

    // Simple query to test
    db.get("SELECT 1 as test", (err, row) => {
      db.close();
      if (err) {
        res.json({
          status: "error",
          message: err.message,
        });
      } else {
        res.json({
          status: "success",
          data: row,
          message: "Database query successful",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Your API routes (without your custom functions for now)
app.post("/api/cards", (req, res) => {
  try {
    console.log("POST /api/cards received:", req.body);
    const db = getDb();

    // Simple insert example
    db.run(
      "INSERT INTO cards (data) VALUES (?)",
      [JSON.stringify(req.body)],
      function (err) {
        db.close();
        if (err) {
          res.json({
            status: "error",
            message: err.message,
          });
        } else {
          res.json({
            status: "success",
            data: { id: this.lastID, ...req.body },
            message: "Card created",
          });
        }
      },
    );
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

app.get("/api/cards/:id", (req, res) => {
  try {
    console.log("GET /api/cards/:id", req.params.id);
    const db = getDb();

    db.get("SELECT * FROM cards WHERE id = ?", [req.params.id], (err, row) => {
      db.close();
      if (err) {
        res.json({
          status: "error",
          message: err.message,
        });
      } else if (!row) {
        res.status(404).json({
          status: "fail",
          message: "Card not found",
        });
      } else {
        res.json({
          status: "success",
          data: row,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
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
