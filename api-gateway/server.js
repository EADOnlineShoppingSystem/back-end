import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3500;


app.use(cors());
app.use((req,res,next)=>{
    console.log(`${req.method} ${req.url}`);
    next();
});


app.use(
    "/order",
    createProxyMiddleware({
        target: "http://localhost:5001",
        changeOrigin: true,
        onError: (err, req, res) => {
        console.error('Order service proxy error:', err.message);
        res.status(500).send('Order service is unavailable.');
    }})
);


app.use(
    "/Product",
    createProxyMiddleware({
        target: "http://localhost:6002",
        changeOrigin: true,
        onError: (err, req, res) => {
        console.error('Product service proxy error:', err.message);
        res.status(500).send('product service is unavailable.');
    }})
);

app.use(
    "/auth",
    createProxyMiddleware({
        target: "http://localhost:5002",
        changeOrigin: true,
         onError: (err, req, res) => {
        console.error('Order service proxy error:', err.message);
        res.status(500).send('Order service is unavailable.');
    }})
    
)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);})