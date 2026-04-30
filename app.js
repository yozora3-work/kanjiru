import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express from "express";
import { getData } from "./src/api/getData.js";
const helmet = require("helmet");
const cors = require("cors");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("dbtest.db");

const app = express();
app.use(cors());
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

app.post("/api/cards", async (req, res) => {
  const data = await getData(db, req.body);
  res.status(200).json({
    status: "success",
    data,
  });
});

export default app;
