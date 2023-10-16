const { bookNicu, donationNicu } = require("../controllers/book.controller.js");
const routerBook = require("express").Router();

routerBook.post('/nicu' , bookNicu)
routerBook.post('/donate' , donationNicu)

module.exports = routerBook;