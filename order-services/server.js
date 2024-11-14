import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import oderRoutes from "./routes/oder.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use("/api/orders", oderRoutes);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Failed to connect to MongoDB", err));

app.get("/", (req, res) => {
    return res.json({ message: "Hello from order services" });
});