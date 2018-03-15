var express = require('express');
var router = express.Router();
var site = require('../model/site');
var event = require('../model/event');



/* GET home page. */
router.get('/', isLoggedIn, function (req, res, next) {
  res.render('site', {  user: sess.usuarioDatos });
});





router.get('/read', function (req, res, next) {
  site.read(function (error, datos) {
    if (error) {
   
    } else {
      res.send(datos);
    }
  })
});

router.get('/read2', function (req, res, next) {
  site.read2(function (error, datos) {
    if (error) {
   
    } else {
      res.send(datos);
    }
  })
});

router.post('/update',isLoggedIn, function (req,res,next) {
   var data= req.body;
   site.update(data,function(error, datos){
    if (error) {
      res.sendStatus(500);
    } else {

      if (datos.affectedRows>0) {
        var changes = {
          table: 'SITE',
          values: JSON.stringify(data),
          user: req.session.usuarioDatos.name,
          ip: req.ip,
          type: 'UPDATE'
        };
  
        event.create(changes, function (result) {
          console.log(result);
        });
           res.send(true);
      } else {
            res.sendStatus(500);
      }
    }
  })
})

router.post('/delete', isLoggedIn, function (req,res,next) {
   var data= req.body;
   site.delete(data,function(error, datos){
    if (error) {
  
      res.sendStatus(500);
    } else {

      if (datos.affectedRows>0) {
        var changes = {
          table: 'SITE',
          values: JSON.stringify(data),
          user: req.session.usuarioDatos.name,
          ip: req.ip,
          type: 'DELETE'
        };
  
        event.create(changes, function (result) {
          console.log(result);
        });
           res.send(true);
      } else {
            res.sendStatus(500);
      }
    }
  })
})


router.post('/create', function (req,res,next) {
   var data= req.body;
   site.create(data,function(error, datos){
    if (error) {
    
      res.sendStatus(500);
    } else {

      if (datos.affectedRows>0) {
        var changes = {
          table: 'SITE',
          values: JSON.stringify(data),
          user: req.session.usuarioDatos.name,
          ip: req.ip,
          type: 'CREATE'
        };
  
        event.create(changes, function (result) {
          console.log(result);
        });
           res.send(true);
      } else {
            res.sendStatus(500);
      }
    }
  })
})

function isLoggedIn(req, res, next) {
  sess = req.session;
  if (sess.usuarioDatos)
    return next();
  sess.originalUrl = req.originalUrl;
  res.redirect('/login');
}






module.exports = router;
