// Import your main app
import app from "./app.js";

// Vercel serverless handler
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Pass request to Express app
    await app(req, res);
  } catch (error) {
    console.error("Error in handler:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error",
    });
  }
}
