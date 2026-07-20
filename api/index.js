import express from "express";
import path from "path";
import fs from "fs";
import process from "process";
import sqlite3 from "sqlite3";

// ✅ Make sure this path is correct
// If your getData.js is in src/api/
import {
  getData,
  updateData,
  deleteData,
  createData,
} from "../src/api/getData.js";

const app = express();

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

// Database helper
const getDb = () => {
  try {
    const sourcePath = path.join(process.cwd(), "dbtest.db");
    const targetPath = "/tmp/dbtest.db";

    // Copy to /tmp for Vercel
    if (process.env.VERCEL && fs.existsSync(sourcePath)) {
      if (!fs.existsSync(targetPath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log("✅ Copied database to /tmp");
      }
    }

    const dbPath =
      process.env.VERCEL && fs.existsSync(targetPath) ? targetPath : sourcePath;
    console.log("📁 Using database at:", dbPath);

    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("❌ Database error:", err.message);
      } else {
        console.log("✅ Connected to database");
      }
    });

    return db;
  } catch (error) {
    console.error("❌ Database error:", error);
    throw error;
  }
};

// Debug endpoint - test without getData
app.get("/api/debug/db", (req, res) => {
  try {
    const dbPath = path.join(process.cwd(), "dbtest.db");
    const exists = fs.existsSync(dbPath);

    res.json({
      status: "success",
      databaseExists: exists,
      dbPath: dbPath,
      cwd: process.cwd(),
      isVercel: !!process.env.VERCEL,
      files: fs.readdirSync(".").slice(0, 10),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// ✅ TEST: Simple POST without getData
app.post("/api/cards-test", (req, res) => {
  try {
    console.log("Test POST received:", req.body);
    const db = getDb();

    const data = JSON.stringify(req.body);
    db.run("INSERT INTO testData (data) VALUES (?)", [data], function (err) {
      db.close();
      if (err) {
        return res.status(500).json({
          status: "error",
          message: err.message,
        });
      }

      res.json({
        status: "success",
        data: { id: this.lastID, ...req.body },
        message: "Test card created (without getData)",
      });
    });
  } catch (error) {
    console.error("Test POST error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
      stack: error.stack,
    });
  }
});

// ✅ Your actual POST endpoint with getData
app.post("/api/cards", async (req, res, next) => {
  try {
    console.log("POST /api/cards received:", req.body);
    console.log("getData function:", typeof getData);

    // Test if getData exists
    if (typeof getData !== "function") {
      throw new Error("getData is not a function. Import might be failing.");
    }

    const db = getDb();
    const data = await getData(db, req.body);
    db.close();

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("❌ Error in POST /api/cards:", err);
    console.error("Stack:", err.stack);
    err.statusCode = 404;
    next(err);
  }
});

// GET endpoint with getData
app.get("/api/cards/:id", async (req, res, next) => {
  try {
    console.log("GET /api/cards/:id", req.params.id);

    if (typeof getData !== "function") {
      throw new Error("getData is not a function");
    }

    const db = getDb();
    const data = await getData(db, {
      id: req.params.id,
      customStudyKanji: true,
      customStudyVocab: true,
      customStudyReading: true,
    });
    db.close();

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("❌ Error in GET /api/cards/:id:", err);
    err.statusCode = 404;
    next(err);
  }
});

// PUT endpoint
app.put("/api/cards", async (req, res, next) => {
  try {
    console.log("PUT /api/cards received:", req.body);

    if (typeof createData !== "function") {
      throw new Error("createData is not a function");
    }

    const db = getDb();
    const data = await createData(db, req.body);
    db.close();

    res.status(201).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("❌ Error in PUT /api/cards:", err);
    err.statusCode = 404;
    next(err);
  }
});

// PATCH endpoint
app.patch("/api/cards/:id", async (req, res, next) => {
  try {
    console.log("PATCH /api/cards/:id", req.params.id, req.body);

    if (typeof updateData !== "function") {
      throw new Error("updateData is not a function");
    }

    const db = getDb();
    const data = await updateData(db, req.params.id, req.body);
    db.close();

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("❌ Error in PATCH /api/cards/:id:", err);
    err.statusCode = 404;
    next(err);
  }
});

// DELETE endpoint
app.delete("/api/cards/:id", async (req, res, next) => {
  try {
    console.log("DELETE /api/cards/:id", req.params.id);

    if (typeof deleteData !== "function") {
      throw new Error("deleteData is not a function");
    }

    const db = getDb();
    const data = await deleteData(db, req.params.id);
    db.close();

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("❌ Error in DELETE /api/cards/:id:", err);
    err.statusCode = 404;
    next(err);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on the server`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Final error handler:", err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
