const multer = require("multer");
const fs = require("fs");
const path = require("path");

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
