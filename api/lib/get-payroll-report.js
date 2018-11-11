'use strict';

const async = require('async');
const config = require('../../config/config').getconfig();
const path = require('path');
const fs = require('fs');
const logger = require('log4js').getLogger();
logger.level = config.logLevel;
const dbrouter = require('./database-router');

/**
 * @description
 *  Main entry to get payroll report. Read from database table and format response
 *  into JSON.
 *
 * @param options {uid, accessToken}
 * @param callback
 */
exports.getPayrollReport = function getPayrollReport(options, callback) {
  logger.debug("received request to get payroll report");
  async.waterfall([
    async.apply(dbrouter.selectPayrollReport, options)
  ], function(err, result) {
    if (err) {
      logger.debug(err.message);
      return callback(null, []);
    } else {
      return callback(null, result);
    }
  });
};
