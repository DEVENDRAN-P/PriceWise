import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Get the directory where this file is located
  const currentDir = path.dirname(path.resolve(process.argv[1]));
  
  // Try multiple possible paths for the public directory
  const possiblePaths = [
    path.resolve(currentDir, "public"),           // same directory as index.cjs
    path.resolve(currentDir, "..", "public"),     // parent directory
    path.resolve(currentDir, "dist", "public"),   // dist/public from root
  ];
  
  let distPath: string | null = null;
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      distPath = possiblePath;
      console.log(`[static] serving files from: ${distPath}`);
      break;
    }
  }
  
  if (!distPath) {
    throw new Error(
      `Could not find the build directory. Tried: ${possiblePaths.join(", ")}`
    );
  }

  // Set proper headers for static files
  app.use((req, res, next) => {
    // Set cache headers for assets
    if (req.path.startsWith("/assets/")) {
      res.set("Cache-Control", "public, max-age=31536000, immutable");
    } else if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico)$/)) {
      res.set("Cache-Control", "public, max-age=3600, immutable");
    } else if (req.path === "/index.html" || req.path === "/") {
      res.set("Cache-Control", "public, max-age=0, must-revalidate");
    }
    next();
  });
  
  app.use(express.static(distPath, {
    setHeaders: (res, path) => {
      // Ensure text files are displayed, not downloaded
      if (path.endsWith('.txt') || path.endsWith('.md') || path.endsWith('.json')) {
        res.set('Content-Disposition', 'inline');
        res.set('Content-Type', 'text/plain; charset=utf-8');
      }
    }
  }));

  // fall through to index.html if the file doesn't exist (for SPA routing)
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.set("Content-Type", "text/html");
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Not found");
    }
  });
}
