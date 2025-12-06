const express = require("express");
const { getAllUser, getAllLog } = require("../controllers/user");
const cekLogin = require("../middlewares/cekLogin");
const cekRole = require("../middlewares/cekRole");
const router = express.Router();

router.get("/", [cekLogin, cekRole("admin")], getAllUser);
router.get("/log", [cekLogin, cekRole("admin")], getAllLog);

module.exports = router;
