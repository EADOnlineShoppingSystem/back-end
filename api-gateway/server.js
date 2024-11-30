import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3500;

// Read backend URLs from environment variables, with fallbacks for local development
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://localhost:5001";
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://localhost:6002";
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5000";

app.use(cors());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Proxy for Order Service
app.use(
    "/order",
    createProxyMiddleware({
        target: ORDER_SERVICE_URL,
        changeOrigin: true,
        onError: (err, req, res) => {
            console.error("Order service proxy error:", err.message);
            res.status(500).send("Order service is unavailable.");
        },
    })
);

// Proxy for Product Service
app.use(
    "/Product",
    createProxyMiddleware({
        target: PRODUCT_SERVICE_URL,
        changeOrigin: true,
        onError: (err, req, res) => {
            console.error("Product service proxy error:", err.message);
            res.status(500).send("Product service is unavailable.");
        },
    })
);

// Proxy for User Service
app.use(
    "/User",
    createProxyMiddleware({
        target: USER_SERVICE_URL,
        changeOrigin: true,
        onError: (err, req, res) => {
            console.error("User service proxy error:", err.message);
            res.status(500).send("User service is unavailable.");
        },
    })
);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
});
