import { createProxyMiddleware } from "http-proxy-middleware";

export const authProxy = createProxyMiddleware({
    target: "http://auth-service:5001",
    changeOrigin: true,
    pathRewrite: {
        "^/auth": "",
    },
});

export const chatProxy = createProxyMiddleware({
    target: "http://chat-service:5002",
    changeOrigin: true,
    pathRewrite: {
        "^/chat": "",
    },
});

export const socketProxy = createProxyMiddleware({
    target: "http://socket-service:5003",
    changeOrigin: true,
    pathRewrite: {
        "^/socket.io": "",
    },
});

export const notificationProxy = createProxyMiddleware({
    target: "http://notification-service:5004",
    changeOrigin: true,
    pathRewrite: {
        "^/notifications": "",
    },
});