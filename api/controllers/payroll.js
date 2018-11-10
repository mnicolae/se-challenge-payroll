'use strict';

const fs = require('fs');
const path = require('path');

const upload = require('../lib/upload-time-report');

const config = require('../../config/config').getconfig();
const logger = require('log4js').getLogger();
logger.level = config.logLevel;

module.exports = {
  uploadTimeReport: uploadTimeReport
};

/**
 * @pre
 *  POST /v1/payroll/uploadTimeReport routes to `uploadTimeReport`.
 *
 * @description
 * Upload a time report.
 *
 * @param req #request object
 * @param res #response object
 */
function uploadTimeReport(req, res) {
  logger.debug("call to upload time report");
  const options = {
    timeReportFile: req.files.timeReportFile.path,
  };
  logger.debug("options received: " + options);

  upload.uploadReport(options, function(err, result) {
    if (err) {
      logger.debug("error received: err: " + err + " result: " + result);

      // remove the time report file
      fs.unlink(options.timeReportFile, function(err) {
        if (err) {
          logger.debug(err.message);
        }
      });
      // if result is not initialized default to 400
      if (result == null) {
        result = 400;
      }
      res.status(result);
      return res.json({
        success: false,
        message: err.message
      });
    }
    if (result) {
      // remove the time report file
      fs.unlink(options.timeReportFile, function(err) {
        if (err) {
          logger.debug(err.message);
        }
      });

      return res.json({
        success: true,
        message: result
      });
    } else {
      // remove the time report file
      fs.unlink(options.timeReportFile, function(err) {
        if (err) {
          logger.debug(err.message);
        }
      });

      res.status(400);
      return res.json({
        success: false,
        message: 'Error uploading time report.'
      });
    }
  });
}
