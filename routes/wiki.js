var express = require('express');
var router = express.Router();

router.get("/", function(req, res, next) {
  res.redirect("/");
});

router.post("/", function(req, res, next) {
  res.status(200).send("Testing the /wiki post route");
});

router.get("/add", function(req, res, next) {
  var locals = { };
  res.render("addpage", locals);
});

module.exports = router;