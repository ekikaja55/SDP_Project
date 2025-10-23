const cekRole = (allowrole) => {
  return (req, res, next) => {
    if (req.userLogin.user_role !== allowrole)
      return res.status(403).json({
        message: "Anda tidak memiliki akses untuk halaman ini",
        result: null,
      });
    next();
  };
};

module.exports = cekRole;
