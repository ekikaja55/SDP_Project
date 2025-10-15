const express = require("express");
const {
  insertProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} = require("../controllers/product");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post("/", [upload("produk_gambar")], insertProduct);
router.put("/:id", [upload("produk_gambar")], updateProduct);
router.delete("/:id", deleteProduct);
router.get("/", getAllProducts);

module.exports = router;
