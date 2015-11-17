var express = require('express');
var router = express.Router();
var models = require('../models/index.js');
var Page = models.Page;
var User = models.User;

router.get("/", function(req, res, next) {
  res.redirect("/");
});

router.post("/", function(req, res, next) {
  var title = req.body.title;
  var content = req.body.content;
  // var status = req.body.status;
  // var author = req.body.author;
  var page = new Page({
    title: title,
    content: content
  });

  page.save()
    .then(function() {
      res.redirect(page.route);
    })
    .then(null, function(err) {
      console.error(err);
    });
});

router.get("/add", function(req, res, next) {
  var locals = { };
  res.render("addpage", locals);
});

router.get("/:urlTitle",function(req,res,next){
  Page.findOne({urlTitle: req.params.urlTitle}).exec()
    .then(function(value){
      res.render("wikipage",value);
      console.log(value);
    })
    .then(null, function(err) {
      console.error(err);
    });
  
});

module.exports = router;