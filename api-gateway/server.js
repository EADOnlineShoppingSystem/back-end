import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import apiKeyMiddleware from './middlewares/apiKeyMiddleware';

const app = express();
const PORT = process.env.PORT || 3500;


app.use((req,res,next)=>{
    console.log(`${req.method} ${req.url}`);
    next();
});


app.use(
    "/order",
    createProxyMiddleware({
        target: "http://localhost:5001",
        changeOrigin: true,})
);

app.use(
    "/auth",
    createProxyMiddleware({
        target: "http://localhost:5002",
        changeOrigin: true,})
    
)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);})