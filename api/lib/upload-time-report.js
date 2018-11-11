const csv = require('csv-parser');
const fs = require('fs');

const config = require('../../config/config').getconfig();
const logger = require('log4js').getLogger();
const async = require('async');
logger.level = config.logLevel;
const dbrouter = require('./database-router.js');

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
  logger.debug("parsing time report file");

  let stream = fs.createReadStream(options.timeReportFile).pipe(csv());

  // emitted for each row of data parsed, except the header row
  stream.on('data', (data) => {
    // insert entry into database here
  });

  stream.on('end', () => {
    logger.debug("finished parsing time report file")
  });

  return callback(null, "Placeholder for now");
}
