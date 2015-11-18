var express = require('express');
var router = express.Router();
var models = require('../models/index.js');
var Page = models.Page;
var User = models.User;
var Promise = require('bluebird');

router.get('/', function (req, res, next) {
    User.find({}).exec()
        .then(function (users) {
            res.render('userlist', { users: users });
        })
        .then(null, next);
});

router.get('/:userId', function (req, res, next) {
    var findUser = User.findById(req.params.userId).exec();
    var findPages = Page.find({ author: req.params.userId }).exec();
    Promise.all([findUser, findPages])
        .then(function (info) {
            var foundUser = info[0];
            var foundPages = info[1];
            res.render('userpages', {
                pages: foundPages,
                user: foundUser
            });
        })
        .then(null, next);
});

module.exports = router;