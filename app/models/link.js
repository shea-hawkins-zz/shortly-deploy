var db = require('../config');
var crypto = require('crypto');
var util = require('../../lib/utility');
// Link methods
// createLink(url) // return a Link that's been added to DB
// clickLink(Link) // increment visits on link

var Link = db.model('Link', {
  url: { type: String, unique: true },
  baseUrl: String,
  code: String,
  title: String,
  visits: String
});

module.exports = {
  create: function(url) {
    var shasum = crypto.createHash('sha1');
    shasum.update(url);
    var code = shasum.digest('hex').slice(0, 5);
    return new Promise(function(resolve, reject) {
      util.getUrlTitle(url, function(err, title) {
        err ? reject(err) : resolve(title);
      });
    })
    .then(function(title) {
      return new Promise(function(resolve, reject) {
        var link = new Link({url: url, code: code, visits: 0, title: title});
        link.save(function(err) {
          err ? reject(err) : resolve(link);
        });
      });
    });
  },
  fetch: function() {
    return new Promise(function(resolve, reject) {
      Link.find({}, '', function(err, links) {
        console.log(links);
        err ? reject(err) : resolve(links);
      });
    });

  },
  getUrl: function(code) {}, //returns false if doesn't exist else url
  getLink: function(url) {
    return new Promise(function(resolve, reject) {
      Link.findOne({url: url}, '', function(err, link) {
        err ? reject(err) : resolve(link);
      });
    });
  },
  click: function(code) {},

};
