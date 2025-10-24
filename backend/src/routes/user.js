const express = require("express");
const { getAllUser } = require("../controllers/user");
const cekLogin = require("../middlewares/cekLogin");
const cekRole = require("../middlewares/cekRole");
const router = express.Router();

router.get("/", [cekLogin, cekRole("admin")], getAllUser);

module.exports = router;
