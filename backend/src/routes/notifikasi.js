const express = require("express");
const { getAllNotifikasi, updateIsRead, updateAllIsRead } = require("../controllers/notifikasi");
const cekLogin = require("../middlewares/cekLogin");
const cekRole = require("../middlewares/cekRole");
const router = express.Router();

router.get("/", [cekLogin, cekRole("admin")], getAllNotifikasi);
router.put("/:id", [cekLogin, cekRole("admin")], updateIsRead);
router.get("/allread", [cekLogin, cekRole("admin")], updateAllIsRead);

module.exports = router;
