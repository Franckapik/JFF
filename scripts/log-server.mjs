import http from "node:http";

const server = http.createServer((req, res) => {
  // CORS headers for browser requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/log") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { level, args, meta } = JSON.parse(body);
        const prefix = meta ? `[browser:${meta}]` : "[browser]";
        const fn =
          level === "error" ? console.error :
          level === "warn" ? console.warn :
          console.log;
        fn(prefix, ...args);
      } catch (e) {
        console.error("[browser] invalid log payload", e);
      }
      res.writeHead(204);
      res.end();
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(5123, () => {
  console.log("🚀 Browser log server listening on http://localhost:5123/log");
});
