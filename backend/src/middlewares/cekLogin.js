const jwt = require("jsonwebtoken");
require("dotenv").config();
const cekLogin = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Header not found", result: null });
  const accessToken = authHeader.split(" ")[1];
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "invalid token", result: null });
    req.userLogin = decoded;
    next();
  });
};

module.exports = cekLogin;
