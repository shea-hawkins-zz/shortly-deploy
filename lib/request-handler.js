var request = require('request');
var util = require('../lib/utility');

var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.fetch().then(function(links) {
    res.status(200).send(links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.getLinkFromUrl(uri).then(function(foundLink) {
    if (foundLink) {
      return res.status(200).send(result);
    } else {
      Link.create(uri).then(function(newLink) {
        res.status(200).send(newLink);
      })
      .catch(function(err) {
        res.status(404).send(JSON.stringify(err));
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.validate(username, password).then(function(validated) {
    if (validated) {
      util.createSession(req, res, username);
    } else {
      res.redirect('/login');
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.create(username, password)
  .then(function(created) {
    util.createSession(req, res, created);
  })
  .catch(function(err) {
    console.log('Account already exists');
    res.redirect('/signup');
  });
};

exports.navToLink = function(req, res) {
  Link.getLinkFromCode(req.params[0])
  .then(function(link) {
    if (link) {
      Link.click(link);
      res.redirect(link.url);
    } else {
      res.redirect('/');
    }
  });
};