var newsyRouter = require('express').Router();
var newsyController = require('./newsyController.js');
var verifyToken = require ('../tokenVerify.js')
newsyRouter.route('/home')
.all(function (req, res, next) {
    // runs for all HTTP verbs first
    // think of it as route specific middleware!
    next()
  })
.post(verifyToken, newsyController.addingPost)
.get( verifyToken,newsyController.retriveAll);

newsyRouter.route('/filter/:category')
.all(function(req, res, next) {
    next()
})
.get(newsyController.filter);

newsyRouter.route('/delete/:id')
.all(function(req, res, next) {
    next()
})
.delete(verifyToken, newsyController.delete);

newsyRouter.route('/myProfile')
.all(function(req, res, next) {
    next()
})
.get(verifyToken,newsyController.userProfile);

newsyRouter.route('/save/:id')
.all(function(req, res, next) {
    next()
})
.delete(verifyToken, newsyController.unsave);

newsyRouter.route('/save')
.all(function(req, res, next) {
    next()
})
.post(verifyToken, newsyController.savePost)

newsyRouter.route('/likes')
.all(function(req, res, next) {
    next()
})
.post(verifyToken, newsyController.like)

newsyRouter.route('/favorite')
.all(function(req, res, next) {
    next()
})
.get(verifyToken, newsyController.favorite);


module.exports.newsyRouter = newsyRouter;