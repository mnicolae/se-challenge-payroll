'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var YAML = require('yamljs');
const configs = require('./config/config').getconfig();
var fs = require('fs');

const swaggerDocument = YAML.load('./api/swagger/swagger.yaml');

const logger = require('log4js').getLogger();
logger.level = configs.logLevel;

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

var logging = require('./api/lib/logging.js');
logging.setup_logging(app);

function haltOnTimedout(req, res, next){
  logger.debug("timeout event hit");
  if (!req.timedout) next();
}

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) {
    throw err;
  }

  // Add headers
  app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers',
      'Origin, Authorization, Content-Type');

    // Set to true if you need the website to include cookies in the requests
    // sent to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
  });

  // Enable formidable upload middleware to handle file uploads
  const uploadMiddleware = require('./api/lib/upload-middleware');
  app.post('/v1/payroll/uploadTimeReport', uploadMiddleware);

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;

  var server = app.listen(port);
  //set timeout to 60 min, before producing 502 error
  server.timeout = configs.serverTimeout;
  app.use(haltOnTimedout);

  logger.debug('Your server is listening on port %d (http://localhost:%d)', port, port);

});
