/******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ******************************************************************************/
'use strict';

const upload = require('./upload-file');
const fs = require('fs');
const config = require('../../config/config').getconfig();
const logger = require('log4js').getLogger();
logger.level = config.logLevel;

/**
 * This middleware parses the raw request and puts files to given `uploadDir`.
 * It makes `files` available to express `req` object.
 * After this middleware completes the processing, swagger routes
 * to the appropriate controller method and in controller method
 * files info is available through `req.files`
 *
 * @param req #request object
 * @param res #response object
 * @param next #the next middleware
 */
function parse(req, res, next) {
  logger.debug("begin middleware");
  upload.uploadFile(req, function(err, result) {
    if (err) {
      logger.debug("middleware failed with: " + err);
      // Cleanup the possible 0 Byte empty file created by the on('file') event,
      // use setTimeout because the file might be created after response
      // is sent.
      if (result && result.timeReportPath) {
        logger.debug("remove file");
        setTimeout(() => {
          fs.unlink(result.timeReportPath, (err) => {
            if (err) logger.debug(err.message);
          })
        }, 0);
      }

    } else if (result.files && result.body) {
      logger.debug("upload working");
      Object.assign(req, {files: result.files, body: result.body});
      next();
    }
  });
}

module.exports = parse;
exports.parse = parse; // backward compatibility
