import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express from "express";
import {
  getData,
  updateData,
  deleteData,
  createData,
} from "./src/api/getData.js";
const helmet = require("helmet");
const cors = require("cors");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("dbtest.db");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.options("/api/cards", cors());

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/cards", async (req, res, next) => {
  try {
    const data = await getData(db, req.body);
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    err.statusCode = 404;
    next(err);
  }
});
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
    err.statusCode = 404;
    next(err);
  }
});

app.put("/api/cards", async (req, res, next) => {
  try {
    const data = await createData(db, req.body);
    res.status(201).json({
      status: "success",
      data,
    });
  } catch (err) {
    err.statusCode = 404;
    next(err);
  }
});

app.patch("/api/cards/:id", async (req, res, next) => {
  try {
    const data = await updateData(db, req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    err.statusCode = 404;
    next(err);
  }
});
app.delete("/api/cards/:id", async (req, res, next) => {
  try {
    const data = await deleteData(db, req.params.id);

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    err.statusCode = 404;
    next(err);
  }
});

app.all(`/{*any}`, (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on the server`);
  err.status = "fail";
  err.statusCode = 404;

  next();
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

export default app;
