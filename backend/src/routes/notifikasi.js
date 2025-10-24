const express = require("express");
const { getAllNotifikasi, updateIsRead } = require("../controllers/notifikasi");
const cekLogin = require("../middlewares/cekLogin");
const cekRole = require("../middlewares/cekRole");
const router = express.Router();

router.get("/", [cekLogin, cekRole("admin")], getAllNotifikasi);
router.put("/:id", [cekLogin, cekRole("admin")], updateIsRead);
module.exports = router;
