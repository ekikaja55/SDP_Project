const express = require("express");
const {
  getAllNotifikasi,
  updateIsRead,
  updateAllIsRead,
  getAllNotifikasiCustomer,
} = require("../controllers/notifikasi");
const cekLogin = require("../middlewares/cekLogin");
const cekRole = require("../middlewares/cekRole");
const router = express.Router();

router.get("/", [cekLogin, , cekRole("admin")], getAllNotifikasi);
router.get(
  "/cust",
  [cekLogin, , cekRole("customer")],
  getAllNotifikasiCustomer
);
router.put("/:id", [cekLogin], updateIsRead);
router.get("/allread", [cekLogin], updateAllIsRead);

module.exports = router;
