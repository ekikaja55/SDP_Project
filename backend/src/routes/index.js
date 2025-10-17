/**
 * @fileoverview
 * File ini berfungsi sebagai pengelola utama routing dalam folder routes.
 * Mengimpor dan mengekspor router untuk modul auth, product, dan todolist.
 *
 * @module routes/index.js
 */

const authRouter = require("./auth");
const productRouter = require("./product");
const todolistRouter = require("./todolist");

module.exports = {
  authRouter,
  productRouter,
  todolistRouter,
};
