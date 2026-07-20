import { createRequire } from "module";
import path from "path";
import process from "node:process";

const require = createRequire(import.meta.url);

const app = require("./app").default;

const sqlite3 = require("sqlite3").verbose();
const dbPath = path.join(process.cwd(), "", "dbtest.db");
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
