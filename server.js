import { createRequire } from "module";
import path from "path";
import process from "node:process";
import fs from "fs";

const require = createRequire(import.meta.url);

const app = require("./app").default;

const sqlite3 = require("sqlite3").verbose();
const dbPath = path.join(process.cwd(), "dbtest.db");
// eslint-disable-next-line no-unused-vars
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
});

const port = 5173;

// eslint-disable-next-line no-unused-vars
const server = app.listen(port, () =>
  console.log(`app running on port ${port}...`),
);

app.get("/api/debug/db", async (req, res) => {
  try {
    console.log("=== Debug Database ===");
    console.log("Current directory:", process.cwd());
    console.log("Files:", fs.readdirSync("."));

    // Check if database exists
    const dbPaths = [
      "dbtest.db",
      "/tmp/dbtest.db",
      path.join(process.cwd(), "dbtest.db"),
    ];

    const results = {};
    for (const dbPath of dbPaths) {
      results[dbPath] = fs.existsSync(dbPath);
    }

    res.status(200).json({
      status: "success",
      cwd: process.cwd(),
      files: fs.readdirSync("."),
      databaseExists: results,
      nodeVersion: process.version,
      env: process.env.NODE_ENV,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// process.on("unhandledRejection", (err) => {
//   console.error(err.name, err.message);
//   console.log("Unhandled Rejection. Shutting down...");
//   server.close(() => {
//     process.exit(1);
//   });
// });

// db.serialize(() => {
//   db.each("SELECT * FROM testData WHERE sort_id = 40", (err, data) => {
//     console.log(data);
//   });
// });
