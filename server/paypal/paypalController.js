var Paypal    = require('./paypalModel.js');
var  Q       = require('q');
var  util    = require('../config/utils.js');
var request = require('request');
var querystring = require('querystring');
var url = require('url');

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "application/json"
};

module.exports = {
  transaction: function (req, res, next) {
    console.log("req.boyd is", req.body);
    console.log('+++++++++++++++++++++++++++++++++++++++++++++');
    console.log('req.gethost ', req.get('host'));

    var response = req.body;
    res.writeHead(200, 'OK');
    res.end();
    //res.json(response);
  },

  test: function(req, res, next) {
    console.log('Received POST /'.bold);
    console.log(req.body);
    console.log('+++++++++++++++++++++++++++++++++++++++++++++');
    console.log('req.query ', req.query);

    console.log('\n\n');

    // STEP 1: read POST data
    req.body = req.body || {};
    //res.send(200, 'OK');
    //res.end();

    // read the IPN message sent from PayPal and prepend 'cmd=_notify-validate'
    //store in postreq and databaseObject
    var postreq = 'cmd=_notify-validate';
    var databaseObject = {};
    for (var key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        //build up postreq string to send back to Paypal
        var value = querystring.escape(req.query[key]);
        postreq = postreq + "&" + key + "=" + value;
        //populate databaseObject for storage in DB
        databaseObject[key] = querystring.escape(req.query[key]);
      }
    }
    //Test posting it to DB
    //module.exports.postToDatabase(databaseObject);

    // Step 2: POST IPN data back to PayPal to validate
    console.log('Posting back to paypal'.bold);
    console.log('++++))))____+++++_____)))))');
    console.log(postreq);
    console.log('\n\n');
    var options = {
      //url: 'http://localhost:8000/api/paypal',
      url: 'https://www.sandbox.paypal.com/cgi-bin/webscr',
      method: 'POST',  //Change to POST
      headers: {
        'Connection': 'close'
      },
      body: postreq,
      strictSSL: true,
      rejectUnauthorized: false,
      requestCert: true,
      agent: false
    };


    request(options, function callback(error, response, body) {
      if (!error && response.statusCode === 200) {

        // inspect IPN validation result and act accordingly

        if (body.substring(0, 8) === 'VERIFIED'){
          // The IPN is verified, process it and post to DATABASE
          console.log('Verified IPN!'.green);
          console.log('\n\n');
          //store in MongoDB
          module.exports.postToDatabase(databaseObject);

          // assign posted variables to local variables
          var item_name = req.body['item_name'];
          var item_number = req.body['item_number'];
          var payment_status = req.body['payment_status'];
          var payment_amount = req.body['mc_gross'];
          var payment_currency = req.body['mc_currency'];
          var txn_id = req.body['txn_id'];
          var receiver_email = req.body['receiver_email'];
          var payer_email = req.body['payer_email'];

          //Lets check a variable
          console.log("Checking variable".bold);
          console.log("payment_status:", payment_status)
          console.log('\n\n');

          // IPN message values depend upon the type of notification sent.
          // To loop through the &_POST array and print the NV pairs to the screen:
          console.log('Printing all key-value pairs...'.bold)
          for (var key in req.body) {
            if (req.body.hasOwnProperty(key)) {
              var value = req.body[key];
              console.log(key + "=" + value);
            }
          }

        } else if (body.substring(0, 7) === 'INVALID') {
          // IPN invalid, log for manual investigation
          console.log('Invalid IPN!'.error);
          console.log('\n\n');
        }
      }
    });

  },

  postToDatabase: function(recordObj){
    console.log("got into post fcn");
    var txn_id = recordObj.tax_id;
    var createPurchaseRecord = Q.nbind(Paypal.create, Paypal);
    var findRecord = Q.nbind(Paypal.findOne, Paypal);

    findRecord({txn_id: txn_id})
      .then(function (match) {
        if (match) {
          //tell user it's already in the DB
          res.send(match);
        } else {
          return  recordObj;
        }
      })
      .then(function (record) {
        if (record) {
          var newRecord = record;
          console.log("got before create Record");
          return createPurchaseRecord(newRecord);
        }
      })
      .then(function (createdRecord) {
        if (createdRecord) {
          console.log("record should have been created");
          res.json(createdRecord);
        }
      })
      .fail(function (error) {
        next(error);
      });

  }
};







