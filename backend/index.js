const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
mongoose
  .connect(process.env.url, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("error connection", err));
app.use(express.json());
const cors = require("cors");
app.use(cookieParser());
console.log(process.env.fronturl);
app.use(cors({ origin: process.env.fronturl, credentials: true }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
const Route = require("./Route");
app.use("/api", Route);

app.listen(process.env.port, () => {
  console.log(`Server is running on http://localhost:${process.env.port}`);
});
