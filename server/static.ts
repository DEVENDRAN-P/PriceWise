import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
      break;
    }
  }
  
  if (!distPath) {
    throw new Error(
      `Could not find the build directory. Tried: ${possiblePaths.join(", ")}`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
