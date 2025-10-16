const express = require("express");
const {
  insertProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductKatalog,
} = require("../controllers/product");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post("/", [upload.single("produk_gambar")], insertProduct);
router.put("/:id", [upload.single("produk_gambar")], updateProduct);
router.delete("/:id", deleteProduct);
router.get("/", getAllProducts);
router.get("/katalog", getProductKatalog);
module.exports = router;
