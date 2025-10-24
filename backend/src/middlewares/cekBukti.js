const cekBukti = (req, res, next) => {
  if (!req.file)
    return res.status(400).json({ message: "File tidak ditemukan, harap upload bukti pembayaran anda", result: null });
  next();
};

module.exports = cekBukti;
