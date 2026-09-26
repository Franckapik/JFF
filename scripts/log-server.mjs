import http from "node:http";

const maxBodyBytes = 64 * 1024;
const server = http.createServer((req, res) => {
  const reject = (status) => { res.writeHead(status); res.end(); };
  const origin = req.headers.origin;
  if (origin) {
    try {
      const url = new URL(origin);
      if (url.protocol !== "http:" || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
        reject(403);
        return;
      }
    } catch { reject(403); return; }
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.url !== "/log") { reject(404); return; }
  if (req.method === "OPTIONS") {
    reject(204);
    return;
  }
  if (req.method !== "POST") { reject(405); return; }
  if (req.headers["content-type"]?.split(";")[0] !== "application/json") { reject(415); return; }
  let size = 0;
  const chunks = [];
  req.on("data", (chunk) => {
    if (res.writableEnded) return;
    size += chunk.length;
    if (size > maxBodyBytes) { chunks.length = 0; reject(413); return; }
    chunks.push(chunk);
  });
  req.on("end", () => {
    if (res.writableEnded) return;
    try {
      const { level, args, meta } = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      if (!Array.isArray(args) || args.length > 256 || (meta !== undefined && typeof meta !== "string")) { reject(400); return; }
      const prefix = meta ? `[browser:${meta.slice(0, 128).replace(/[\r\n]/g, " ")}]` : "[browser]";
      const output = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
      output(prefix, ...args);
      reject(204);
    } catch { reject(400); }
  });
  req.on("error", () => { if (!res.writableEnded) reject(400); });
});

server.headersTimeout = 5000;
server.requestTimeout = 10000;
server.listen(5123, "127.0.0.1", () => {
  console.log("Browser log server listening on http://127.0.0.1:5123/log");
});
