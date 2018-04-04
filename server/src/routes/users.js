var express = require('express');
var router = express.Router();
var User = require('../models/users.js');



router.post('/', function(req, res) {
  var user = req.body;
  console.log(user);
  User.createUser(user).then(function(user) {
    res.json(user);
  }).catch(function(err) {
    res.status(400).send(err);
  })
});

// Read user
router.get('/:id?', function (req, res) {
  User.readUser(req.params.id).
    then(function (users) {
      res.json({users: users});
    }).catch(function (err) {
      res.status(400).send(err);
    });
});

router.put('/:id', function(req, res) {
  User.updateUser(req.params.id, req.body).then(function(user) {
    res.json(user);
  }).catch(function(err) {
    res.status(400).send(err);
  });
});

router.delete('/:id', function(req, res) {
  User.deleteUser(req.params.id).then(function(user) {
    res.json(user);
  }).catch(function(err) {
    res.status(400).send(err);
  });
});


module.exports = router;
