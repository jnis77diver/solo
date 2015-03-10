var paypalController = require('./paypalController.js');



module.exports = function (app) {
  // app === userRouter injected from middlware.js

  app.post('/', paypalController.transaction);
  app.get('/', paypalController.test);
};