var express     = require('express'),
    mongoose    = require('mongoose');

var app = express();

var mongoURI = 'mongodb://jnis19:D7P}]x2wHm5u`tp@ds045107.mongolab.com:45107/facebookpaypal'  || 'mongodb://localhost/facebookpaypal';

mongoose.connect(mongoURI); // connect to mongo database named facebookpaypal, either locally or on mongolabs

// configure our server with all the middleware and and routing
require('./config/middleware.js')(app, express);

// export our app for testing and flexibility, required by server.js
module.exports = app;


/* Walkthrough of the server

  Express, mongoose, and our server are initialzed here
  Next, we then inject our server and express into our config/middlware.js file for setup
    we also exported our server for easy testing, it is then started in server.js

  middleware.js requires all epxpress middlware and sets it up
  our authentication is set up there as well
  we also create individual routers for are two main features, links and users
  each feature has it's own folder with a model, controller, and route file
    the respective file is requierd in middlware.js and injected with its mini router
    that route file then requires the respective controller and sets up all the routes
    that controller then requires the respective model and sets up all our endpoints which respond to request

*/