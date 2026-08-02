import express from "express";
import path from "path";
import fs from "fs";
import process from "process";
import sqlite3 from "sqlite3";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const cors = require("cors");

// ✅ Import your data functions
import {
  getData,
  updateData,
  deleteData,
  createData,
} from "../src/api/getData.js";

const app = express();

app.use(express.json());

// CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://kanjiru.vercel.app"
        : `http://localhost:5173`,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400,
  }),
);

// Database import
const getDb = async () => {
  try {
    const sourcePath = path.join(process.cwd(), "dbtest.db");
    const targetPath = "/tmp/dbtest.db";

    // Vercel is only for reading. Copy to /tmp
    if (process.env.VERCEL && fs.existsSync(sourcePath)) {
      if (!fs.existsSync(targetPath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log("Succesfully copied database to /tmp");
      }
    }

    const dbPath =
      process.env.VERCEL && fs.existsSync(targetPath) ? targetPath : sourcePath;
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
    console.error("Database error:", error);
    throw error;
  }
};
const db = await getDb();

// API routes
app.post("/api/cards", async (req, res, next) => {
  console.log("test");
  try {
    const data = await getData(db, req.body);

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("Error in POST /api/cards:", err, err.stack);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
});

// GET by id
app.get("/api/cards/:id", async (req, res, next) => {
  try {
    const data = await getData(db, {
      id: req.params.id,
      customStudyKanji: true,
      customStudyVocab: true,
      customStudyReading: true,
    });

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("Error in GET:", err, err.stack);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
});

// PUT with createData
app.put("/api/cards", async (req, res, next) => {
  try {
    const data = await createData(db, req.body);

    res.status(201).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("Error in PUT:", err, err.stack);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
});

// PATCH with updateData
app.patch("/api/cards/:id", async (req, res, next) => {
  try {
    const data = await updateData(db, req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("Error in PATCH:", err, err.stack);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
});

// DELETE with deleteData
app.delete("/api/cards/:id", async (req, res, next) => {
  try {
    const db = getDb();
    const data = await deleteData(db, req.params.id);
    db.close();

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("Error in DELETE:", err, err.stack);
    err.statusCode = err.statusCode || 500;
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
  console.error("Error handler:", err, err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
