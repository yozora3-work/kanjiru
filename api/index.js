import express from "express";
import path from "path";
import fs from "fs";
import process from "process";
import sqlite3 from "sqlite3";
import { getData } from "../src/api/getData";

const app = express();

// Middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Database helper - uses the correct path
const getDb = () => {
  try {
    // The database is at /var/task/dbtest.db in Vercel
    // But we should copy it to /tmp for write operations
    const sourcePath = path.join(process.cwd(), "dbtest.db");
    const targetPath = "/tmp/dbtest.db";

    // Check if database exists in current directory
    if (fs.existsSync(sourcePath)) {
      console.log("✅ Found database at:", sourcePath);

      // Copy to /tmp if it doesn't exist there or if it's a new deployment
      if (!fs.existsSync(targetPath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log("✅ Copied database to:", targetPath);
      }
    } else {
      console.error("❌ Database not found at:", sourcePath);
      // Try to list files to debug
      try {
        const files = fs.readdirSync(".");
        console.log("Files in current directory:", files);
      } catch (e) {
        console.error("Cannot read directory:", e);
      }
    }

    // Use the database from /tmp for write operations
    const dbPath = fs.existsSync(targetPath) ? targetPath : sourcePath;
    console.log("📁 Using database at:", dbPath);

    const db = new sqlite3.Database(
      dbPath,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) {
          console.error("❌ Database connection error:", err.message);
        } else {
          console.log("✅ Connected to database");
        }
      },
    );

    return db;
  } catch (error) {
    console.error("❌ Database error:", error);
    throw error;
  }
};

// Debug endpoint - shows database status
app.get("/api/debug/db", (req, res) => {
  try {
    const cwd = process.cwd();
    const files = fs.readdirSync(".");

    const dbPaths = {
      cwd: path.join(cwd, "dbtest.db"),
      tmp: "/tmp/dbtest.db",
    };

    const dbExists = {};
    Object.entries(dbPaths).forEach(([key, p]) => {
      dbExists[key] = fs.existsSync(p);
    });

    res.json({
      status: "success",
      cwd: cwd,
      dbExists: dbExists,
      files: files,
      isVercel: !!process.env.VERCEL,
      nodeVersion: process.version,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      stack: error.stack,
    });
  }
});

// Test database query endpoint
app.get("/api/test-db", (req, res) => {
  try {
    const db = getDb();

    // Test query
    db.get("SELECT 1 as test", (err, row) => {
      if (err) {
        db.close();
        return res.json({
          status: "error",
          message: err.message,
        });
      }

      // Try to query your actual table
      db.all(
        "SELECT name FROM sqlite_master WHERE type='table'",
        (err, tables) => {
          db.close();
          if (err) {
            return res.json({
              status: "error",
              message: err.message,
            });
          }

          res.json({
            status: "success",
            test: row,
            tables: tables,
            message: "Database connection successful",
          });
        },
      );
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// POST /api/cards
app.post("/api/cards", async (req, res) => {
  try {
    const db = getDb();
    const data = await getData(db, req.body);
    db.close();
    res.json({ status: "success", data });
  } catch (error) {
    // handle error
  }
});

// GET /api/cards/:id
app.get("/api/cards/:id", (req, res) => {
  try {
    console.log("GET /api/cards/:id", req.params.id);
    const db = getDb();

    db.get(
      "SELECT * FROM testData WHERE id = ?",
      [req.params.id],
      (err, row) => {
        db.close();
        if (err) {
          console.error("Query error:", err);
          return res.status(500).json({
            status: "error",
            message: err.message,
          });
        }

        if (!row) {
          return res.status(404).json({
            status: "fail",
            message: "Card not found",
          });
        }

        // Parse data if it's JSON
        if (row.data && typeof row.data === "string") {
          try {
            row.data = JSON.parse(row.data);
          } catch (e) {
            // Keep as is
          }
        }

        res.json({
          status: "success",
          data: row,
        });
      },
    );
  } catch (error) {
    console.error("GET error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// PUT /api/cards - Update entire card
app.put("/api/cards", (req, res) => {
  try {
    console.log("PUT /api/cards received:", req.body);
    const db = getDb();

    const data = JSON.stringify(req.body);
    db.run("INSERT INTO testData (data) VALUES (?)", [data], function (err) {
      db.close();
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({
          status: "error",
          message: err.message,
        });
      }

      res.json({
        status: "success",
        data: { id: this.lastID, ...req.body },
        message: "Card created via PUT",
      });
    });
  } catch (error) {
    console.error("PUT error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// PATCH /api/cards/:id - Partial update
app.patch("/api/cards/:id", (req, res) => {
  try {
    console.log("PATCH /api/cards/:id", req.params.id, req.body);
    const db = getDb();

    // First get existing data
    db.get(
      "SELECT * FROM testData WHERE id = ?",
      [req.params.id],
      (err, row) => {
        if (err) {
          db.close();
          return res.status(500).json({
            status: "error",
            message: err.message,
          });
        }

        if (!row) {
          db.close();
          return res.status(404).json({
            status: "fail",
            message: "Card not found",
          });
        }

        // Merge existing data with new data
        let existingData = {};
        try {
          existingData = JSON.parse(row.data);
        } catch (e) {
          existingData = {};
        }

        const mergedData = { ...existingData, ...req.body };
        const updatedData = JSON.stringify(mergedData);

        // Update the record
        db.run(
          "UPDATE testData SET data = ? WHERE id = ?",
          [updatedData, req.params.id],
          function (err) {
            db.close();
            if (err) {
              console.error("Update error:", err);
              return res.status(500).json({
                status: "error",
                message: err.message,
              });
            }

            res.json({
              status: "success",
              data: { id: req.params.id, ...mergedData },
              message: "Card updated successfully",
            });
          },
        );
      },
    );
  } catch (error) {
    console.error("PATCH error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// DELETE /api/cards/:id
app.delete("/api/cards/:id", (req, res) => {
  try {
    console.log("DELETE /api/cards/:id", req.params.id);
    const db = getDb();

    db.run(
      "DELETE FROM testData WHERE id = ?",
      [req.params.id],
      function (err) {
        db.close();
        if (err) {
          console.error("Delete error:", err);
          return res.status(500).json({
            status: "error",
            message: err.message,
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            status: "fail",
            message: "Card not found",
          });
        }

        res.json({
          status: "success",
          data: { id: req.params.id },
          message: "Card deleted successfully",
        });
      },
    );
  } catch (error) {
    console.error("DELETE error:", error);
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
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
