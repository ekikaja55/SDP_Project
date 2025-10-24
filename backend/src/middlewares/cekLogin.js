const jwt = require("jsonwebtoken");
require("dotenv").config();

const cekLogin = (req, res, next) => {
  console.log("MASUK CEK LOGIN MIDDLEWARE");
  console.log("isi cookies:", req.cookies);

  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    return res.status(401).json({
      message: "Access token tidak ditemukan di cookies",
      result: null,
    });
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token invalid:", err.message);
      return res.status(403).json({
        message: "Token tidak valid atau sudah kadaluarsa",
        result: null,
      });
    }

    req.userLogin = decoded;
    next();
  });
};

module.exports = cekLogin;
