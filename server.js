import { createRequire } from "module";
const require = createRequire(import.meta.url);

const app = require("./app").default;

const sqlite3 = require("sqlite3").verbose();
// eslint-disable-next-line no-unused-vars
const db = new sqlite3.Database("dbtest.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
});

const port = 5173;

// eslint-disable-next-line no-unused-vars
const server = app.listen(port, () =>
  console.log(`app running on port ${port}...`)
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
