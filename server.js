"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = __dirname;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
};

function sendError(res, status, message) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(message);
}

function resolveStaticPath(urlPathname) {
  const normalizedPathname = urlPathname === "/" ? "/index.html" : urlPathname;
  const relativePath = normalizedPathname.replace(/^\/TicTacToe\/?/, "") || "index.html";
  const resolvedPath = path.normalize(path.join(PUBLIC_DIR, decodeURIComponent(relativePath)));
  const relativeToRoot = path.relative(PUBLIC_DIR, resolvedPath);

  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    return null;
  }

  return resolvedPath;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const resolvedPath = resolveStaticPath(url.pathname);

  if (!resolvedPath) {
    sendError(res, 403, "Forbidden");
    return;
  }

  fs.readFile(resolvedPath, (error, contents) => {
    if (error) {
      sendError(res, 404, "Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentTypes[path.extname(resolvedPath)] || "application/octet-stream",
    });
    res.end(contents);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Tic-Tac-Toe listening on http://127.0.0.1:${PORT}/TicTacToe/`);
});
