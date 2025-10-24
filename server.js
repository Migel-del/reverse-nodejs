import http from "http";
import httpProxy from "http-proxy";

const TARGET = "http://185.87.49.204:2099"; // твой backend
const PORT = process.env.PORT || 8080;

// создаём прокси-сервер
const proxy = httpProxy.createProxyServer({
  target: TARGET,
  ws: true,
  changeOrigin: true,
  secure: false
});

// обычные HTTP-запросы
const server = http.createServer((req, res) => {
  proxy.web(req, res, { target: TARGET }, (err) => {
    console.error("❌ Proxy error:", err);
    res.writeHead(502);
    res.end("Bad Gateway");
  });
});

// поддержка Upgrade (WebSocket/gRPC)
server.on("upgrade", (req, socket, head) => {
  console.log("🔄 Upgrade request:", req.headers["upgrade"]);
  proxy.ws(req, socket, head, { target: TARGET });
});

server.listen(PORT, () => {
  console.log(`🚀 Reverse proxy running on port ${PORT}`);
});
