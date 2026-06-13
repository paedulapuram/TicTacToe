"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.resolve(__dirname, "..");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function sendError(res, status, message) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(message);
}

function getStaticPath(urlPathname) {
  const pathname = urlPathname === "/" ? "/index.html" : urlPathname;
  const relativePath = pathname.replace(/^\/TicTacToe\/?/, "") || "index.html";
  const resolvedPath = path.normalize(path.join(PUBLIC_DIR, decodeURIComponent(relativePath)));
  const rootRelativePath = path.relative(PUBLIC_DIR, resolvedPath);

  if (rootRelativePath.startsWith("..") || path.isAbsolute(rootRelativePath)) {
    return null;
  }

  return resolvedPath;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const staticPath = getStaticPath(url.pathname);

  if (!staticPath) {
    sendError(res, 403, "Forbidden");
    return;
  }

  fs.readFile(staticPath, (error, contents) => {
    if (error) {
      sendError(res, 404, "Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentTypes[path.extname(staticPath)] || "application/octet-stream",
    });
    res.end(contents);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Tic-Tac-Toe listening on port ${PORT}`);
});
