import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // API routes
  if (req.url?.startsWith("/api/")) {
    res.status(200).json({
      message: "PriceWise API",
      path: req.url,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Health check
  res.status(200).json({
    status: "ok",
    message: "PriceWise is running",
  });
}
