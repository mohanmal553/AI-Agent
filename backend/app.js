const express = require("express");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(express.json());

app.use("/api", chatRoutes);

module.exports = app;