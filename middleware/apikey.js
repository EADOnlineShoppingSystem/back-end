import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    apiKey: String,
});
const User = mongoose.model("User", userSchema);

module.exports = async function (req, res, next) {
    const apiKey = req.header("x-api-key");
    if (!apiKey)
        return res.status(401).send("Access denied. No API key provided.");

    const user = await User.findOne({ apiKey });
    if (!user) {
        return res.status(400).send("Invalid API key.");
    }

    req.apiUser = user.username;
    next();
};