const express = require("express");
const { authRouter } = require("./src/routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/api/v1/auth", authRouter);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
