/******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ******************************************************************************/
'use strict';

var fs = require("fs");
var path = require("path");
var rfs = require("rotating-file-stream");
var morgan = require("morgan");

function setup_logging(app) {
  var logDirectory = path.join(__dirname, "..", "log");

  // ensure log directory exists
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

  // create a rotating write stream
  var accessLogStream = rfs("access.log", {
    interval: "1d", // rotate daily
    path: logDirectory,
    maxFiles: 100,
    maxSize: "1G"
  });

  // setup the logger
  app.use(morgan("combined", { stream: accessLogStream }));
  app.use(morgan("dev")); // log to console
}

exports.setup_logging = setup_logging;
