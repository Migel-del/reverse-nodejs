import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const target = "http://185.87.49.204:2099"; // backend, как в nginx

app.use("/", createProxyMiddleware({
  target,
  changeOrigin: true,
  ws: true,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader("Upgrade", req.headers["upgrade"] || "websocket");
    proxyReq.setHeader("Connection", "Upgrade");
  }
}));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🔥 Reverse proxy running on ${PORT}`));
