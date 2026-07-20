// Simple test - NO dependencies that might fail
export default function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Return JSON
  res.status(200).json({
    status: "success",
    message: "API is working!",
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
  });
}
