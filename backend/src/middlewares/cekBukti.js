const cekBukti = (req, res, next) => {
  if (!req.file)
    return res.status(400).json({ message: "Tidak ada file", result: null });
  next();
};

module.exports = cekBukti;
