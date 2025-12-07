const express = require("express");
const {
  insertTransaction,
  getStatusCustomer,
  getHistoriCustomer,
  getLaporanPenjualanAdmin,
  ubahStatusTransaksi,
  getAllTransaction,
  getTransbyId,
} = require("../controllers/transaction");
const cekLogin = require("../middlewares/cekLogin");
const cekRole = require("../middlewares/cekRole");
const upload = require("../middlewares/uploadBukti");
const cekBukti = require("../middlewares/cekBukti");
const router = express.Router();
router.post(
  "/",
  [cekLogin, cekRole("customer"), upload.single("transaksi_img"), cekBukti],
  insertTransaction
);
router.get("/status", [cekLogin, cekRole("customer")], getStatusCustomer);
router.get("/histori", [cekLogin, cekRole("customer")], getHistoriCustomer);
router.get("/laporan", [cekLogin, cekRole("admin")], getLaporanPenjualanAdmin);
router.get("/all", [cekLogin, cekRole("admin")], getAllTransaction);
router.get("/detail", [cekLogin], getTransbyId);

router.put(
  "/status/:transaksi_id",
  [cekLogin, cekRole("admin")],
  ubahStatusTransaksi
);
module.exports = router;
