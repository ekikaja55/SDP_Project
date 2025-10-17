/**
 * @fileoverview src/middleware/upload.js
 * @description Middleware konfigurasi upload file menggunakan Multer.
 * Middleware ini mengatur lokasi penyimpanan file, penamaan file berdasarkan nama produk,
 * serta melakukan validasi tipe file yang diizinkan.
 *
 * @requires multer
 * @requires fs
 * @requires path
 *
 * @module middleware/upload.js
 *
 * @example
 * // Menggunakan middleware upload di route produk:
 * const upload = require("../middleware/upload");
 * router.post("/add", upload.single("produk_gambar"), insertProduk);
 *
 * // File akan tersimpan di folder "uploads/" dengan nama sesuai produk.
 *
 * @example
 * // Response sukses:
 * {
 *   "message": "Sukses upload gambar",
 *   "result": {
 *     "filename": "roti-manis.jpg",
 *     "path": "/uploads/roti-manis.jpg"
 *   }
 * }
 *
 * @example
 * // Response error jika format file tidak didukung:
 * {
 *   "message": "Format file tidak didukung",
 *   "result": null
 * }
 */

const multer = require("multer");
const fs = require("fs");
const path = require("path");

/**
 * @constant
 * @type {import('multer').StorageEngine}
 * @description Konfigurasi penyimpanan file upload.
 * Membuat folder `uploads/` jika belum ada dan memberi nama file sesuai nama produk.
 */
const storageSingle = multer.diskStorage({
  destination: (req, file, callback) => {
    const folderName = path.resolve(__dirname, "../../../uploads");
    if (!fs.existsSync(folderName))
      fs.mkdirSync(folderName, { recursive: true });
    callback(null, folderName);
  },
  filename: (req, file, callback) => {
    const name = req.body.produk_nama.toLowerCase();
    const ext = path.extname(file.originalname);
    callback(null, `${name}${ext}`);
  },
});

/**
 * @constant
 * @type {import('multer').Multer}
 * @description Middleware upload file tunggal dengan validasi tipe file.
 * Mengizinkan file bertipe `.jpeg`, `.jpg`, `.png`, dan `.gif`.
 */
const upload = multer({
  storage: storageSingle,
  fileFilter: (req, file, callback) => {
    if (!file) {
      return callback(null, true);
    }
    const allowedFileType = /jpeg|jpg|png|gif/;
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const cekExtName = allowedFileType.test(fileExtension);
    const cekMimeType = allowedFileType.test(file.mimetype);
    if (cekExtName && cekMimeType) {
      callback(null, true);
    } else {
      callback(new Error("Format file tidak didukung"), false);
    }
  },
});

module.exports = upload;
