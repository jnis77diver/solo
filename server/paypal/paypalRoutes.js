var paypalController = require('./paypalController.js');



module.exports = function (app) {
  // app === userRouter injected from middlware.js

  app.post('/', paypalController.test);
  app.get('/', paypalController.transaction);
};