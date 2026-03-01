// Preload script: patches Node.js HTTP server timeout before Next.js standalone server starts
// This fixes ABORT_ERR when ML backend takes >2 minutes (Node's default HTTP timeout)

const http = require("http");
const originalCreateServer = http.createServer;

const HTTP_TIMEOUT = 600_000; // 10 minutes

http.createServer = function (...args) {
  const server = originalCreateServer.apply(this, args);
  server.timeout = HTTP_TIMEOUT;
  server.keepAliveTimeout = HTTP_TIMEOUT;
  server.headersTimeout = HTTP_TIMEOUT + 1000;
  server.requestTimeout = HTTP_TIMEOUT;
  console.log(`[timeout-patch] HTTP timeout set to ${HTTP_TIMEOUT / 1000}s`);
  return server;
};
