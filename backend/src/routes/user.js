const express = require("express");
const { getAllUser, getAllLog, getUserById } = require("../controllers/user");
const cekLogin = require("../middlewares/cekLogin");
const cekRole = require("../middlewares/cekRole");
const router = express.Router();

router.get("/", [cekLogin, cekRole("admin")], getAllUser);
router.get("/log", [cekLogin, cekRole("admin")], getAllLog);
router.get("/user-detail", [cekLogin, cekRole("admin")], getUserById);

module.exports = router;
