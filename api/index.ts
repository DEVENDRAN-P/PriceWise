import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFileSync } from "fs";
import { join } from "path";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // If it's a request for static files, serve them
  if (req.url && req.url.startsWith("/assets/")) {
    try {
      const filePath = join(process.cwd(), "dist/client", req.url);
      const fileContent = readFileSync(filePath);
      const mimeTypes: { [key: string]: string } = {
        ".js": "application/javascript",
        ".css": "text/css",
        ".html": "text/html",
        ".json": "application/json",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
      };

      const ext = req.url.substring(req.url.lastIndexOf("."));
      res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
      res.send(fileContent);
      return;
    } catch (e) {
      // File not found, continue
    }
  }

  // API routes
  if (req.url?.startsWith("/api/")) {
    res.status(200).json({
      message: "PriceWise API",
      path: req.url,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Serve index.html for all other requests (React routing)
  try {
    const indexPath = join(process.cwd(), "dist/client/index.html");
    const html = readFileSync(indexPath, "utf-8");
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (e) {
    res.status(500).json({ error: "Failed to load application" });
  }
}
