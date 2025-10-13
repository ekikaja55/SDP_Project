const Joi = require("joi");

const userSchema = Joi.object({
  user_email: Joi.string().email().required().label("Email").messages({
    "string.empty": "{{#label}} tidak boleh kosong",
    "any.required": "{{#label}} wajib diisi",
    "string.email":
      "{{#label}} harus berupa format email yang valid (contoh: user@gmail.com)",
  }),
  user_nama: Joi.string().required().label("Nama").messages({
    "string.empty": "{{#label}} tidak boleh kosong",
    "any.required": "{{#label}} wajib diisi",
  }),
  user_password: Joi.string().min(6).required().label("Password").messages({
    "string.empty": "{{#label}} tidak boleh kosong",
    "any.required": "{{#label}} wajib diisi",
    "string.min": "{{#label}} minimal terdiri dari 6 karakter",
  }),
  user_confirm_password: Joi.any()
    .equal(Joi.ref("user_password"))
    .required()
    .label("Confirmation Password")
    .messages({
      "any.only": "{{#label}} harus sama dengan Password",
      "any.required": "{{#label}} wajib diisi",
    }),
});

module.exports = { userSchema };
