const parse = require('csv-parse');
const fs = require('fs');
const readLastLine = require('read-last-line');

const config = require('../../config/config').getconfig();
const logger = require('log4js').getLogger();
const async = require('async');
logger.level = config.logLevel;
const dbrouter = require('./database-router.js');

/**
 * @description
 *  Main entry to upload time report: validate a report with the same id was
 * not already uploaded, TBD.
 *
 * @param options: {timeReportFile}
 * @param callback
 */
exports.uploadReport = function uploadReport(options, callback) {
  logger.debug("received request to upload time report");
  async.waterfall([
    async.apply(validateReportId, options),
    async.apply(validateTimeReportFile, options)
  ], function(err, result) {
    if (err) {
      return callback(err, result);
    } else {
      return callback(null, result);
    }
  });
};

/**
 * @description: Validate a report with the same id was not already uploaded.
 *
 * @param options {timeReportFile}
 * @param callback
 */
function validateReportId(options, callback) {
  logger.debug("validating a report with the same id was not already uploaded");
  readLastLine.read(options.timeReportFile, 2).then(function (lines) {
    const report_id = lines.trim().replace('report id,', '').replace(',,', '');

    const opts = {time_report_id: report_id};
    dbrouter.timeReportIdExists(opts, function(err, res) {
      if (err) {
        return callback(err, 500);
      } else if (res === true) {
        return callback(new Error("report id " + report_id + " already exists"), 400);
      } else {
        return callback();
      }
    });
  }).catch(function (err) {
    return callback(err, 500);
  });
}

/**
 * @description: Parse the given time report file, and store the timekeeping
 * information in a relational database for archival reasons.
 *
 * @param options {timeReportFile}
 * @param callback
 */
function validateTimeReportFile(options, callback) {
  logger.debug("parsing time report file");

  var parser = parse({delimiter: ','}, function (err, data) {
    data.forEach(function(line) {
      var report_entry = {"date": line[0], "hours_worked": line[1],
                          "empid": line[2], "job_group": line[3]};
     logger.debug(JSON.stringify(report_entry));
    });
  });

  let stream = fs.createReadStream(options.timeReportFile).pipe(parser);

  stream.on('end', () => {
    logger.debug("finished parsing time report file");
    return callback(null, "Placeholder for now");
  });
}
