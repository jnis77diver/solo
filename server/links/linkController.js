var Link    = require('./linkModel.js');
var Paypal    = require('../paypal/paypalModel.js');

var  Q       = require('q');
var    util    = require('../config/utils.js');


module.exports = {
  allData: function (req, res, next) {
    var findAll = Q.nbind(Paypal.find, Paypal);

    findAll({})
      .then(function (transactions) {
        //console.log("Transactions", transactions);
        transactions = transactions.map(function(elem) {
          for( var key in elem ) {
            if(  key = 'payment_date' )
              var prettyDate = util.sanitizeDate(elem[key]);
              elem[key] = prettyDate;
            console.log("NOW", elem[key]);
            return elem;
          }
        });
        //console.log("NOW", transactions);
        //transactions['payment_date'] = util.sanitizeDate(transactions['payment_date']);
        res.json(transactions);
      })
      .fail(function (error) {
        next(error);
      });
  },


  findUrl: function (req, res, next, code) {
    var findLink = Q.nbind(Link.findOne, Link);
    findLink({code: code})
      .then(function (link) {
        if (link) {
          req.navLink = link;
          next();
        } else {
          next(new Error('Link not added yet'));
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  allLinks: function (req, res, next) {
  var findAll = Q.nbind(Link.find, Link);

  findAll({})
    .then(function (links) {
      res.json(links);
    })
    .fail(function (error) {
      next(error);
    });
  },

  newLink: function (req, res, next) {
    var url = req.body.url;
    console.log(req.body);
    if (!util.isValidUrl(url)) {
      return next(new Error('Not a valid url'));
    }

    var createLink = Q.nbind(Link.create, Link);
    var findLink = Q.nbind(Link.findOne, Link);

    findLink({url: url})
      .then(function (match) {
        if (match) {
          res.send(match);
        } else {
          return  util.getUrlTitle(url);
        }
      })
      .then(function (title) {
        if (title) {
          var newLink = {
            url: url,
            visits: 0,
            base_url: req.headers.origin,
            title: title
          };
          return createLink(newLink);
        }
      })
      .then(function (createdLink) {
        if (createdLink) {
          res.json(createdLink);
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  navToLink: function (req, res, next) {
    var link = req.navLink;
    link.visits++;
    link.save(function (err, savedLink) {
      if (err) {
        next(err);
      } else {
        res.redirect(savedLink.url);
      }
    });
  }

};
