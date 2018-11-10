const config = require('../../config/config').getconfig();
const logger = require('log4js').getLogger();
const async = require('async');
logger.level = config.logLevel;

/**
 * @description
 *  Main entry to upload time report: TBD.
 *
 * @param options: {timeReportFile}
 * @param callback
 */
exports.uploadReport = function uploadReport(options, callback) {
  logger.debug("received request to upload time report");
  async.waterfall([
    async.apply(validateTimeReportFile, options)
  ], function(err, result) {
    if (err) {
      logger.debug("upload time report err: " + err);
      return callback(err, result);
    } else {
      return callback(null, result);
    }
  });
};

/**
 * @description
 * TBD.
 *
 * @param options
 * @param callback
 */
function validateTimeReportFile(options, callback) {
  logger.debug("validating time report file");
  return callback(null, "Placeholder for now");

}
