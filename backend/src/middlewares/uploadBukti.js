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
    const folderName = path.resolve(__dirname, "../../../uploads");
    const ext = path.extname(file.originalname).toLowerCase();
    const files = fs.readdirSync(folderName);
    const buktiFiles = files.filter((f) =>
      /^bukti\d+\.(jpg|jpeg|png|gif)$/i.test(f)
    );
    const lastNumber = buktiFiles.reduce((max, file) => {
      const num = parseInt(file.match(/^bukti(\d+)/)?.[1] || 0);
      return num > max ? num : max;
    }, 0);
    const newNumber = lastNumber + 1;
    const newFilename = `bukti${newNumber}${ext}`;
    callback(null, newFilename);
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
