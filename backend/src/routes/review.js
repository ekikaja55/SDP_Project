const express = require("express");
const cekLogin = require("../middlewares/cekLogin");
const cekRole = require("../middlewares/cekRole");
const {
  getProdukYangPernahDibeli,
  tambahReview,
  laporanReview,
} = require("../controllers/review");
const router = express.Router();

router.get("/", [cekLogin, cekRole("customer")], getProdukYangPernahDibeli);
router.post("/", [cekLogin, cekRole("customer")], tambahReview);
router.get("/laporan", [cekLogin, cekRole("admin")], laporanReview);
module.exports = router;
