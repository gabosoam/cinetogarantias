var express = require('express');
var router = express.Router();
var ticket = require('../model/ticket');
var product = require('../model/product');
var event = require('../model/event');

/* GET home page. */
router.get('/', isLoggedIn, function (req, res, next) {
  res.render('ticket', { user: sess.usuarioDatos });
});



router.get('/read', isLoggedIn, function (req, res, next) {
  var billsend = req.params.bill;

  ticket.read( function (error, data) {

    res.send(data);
  })

});



function isLoggedIn(req, res, next) {
  sess = req.session;
  if (sess.usuarioDatos)
    return next();
  sess.originalUrl = req.originalUrl;
  res.redirect('/login');
}

function isLoggedInAdmin(req, res, next) {
	sess = req.session;

	if (sess.adminDatos)
	return next();
	sess.originalUrl = req.originalUrl;
	res.redirect('/login');
}







module.exports = router;
