const parse = require('csv-parse');
const fs = require('fs');
const readLastLine = require('read-last-line');

const config = require('../../config/config').getconfig();
const logger = require('log4js').getLogger();
const async = require('async');
logger.level = config.logLevel;
const dbrouter = require('./database-router.js');
const dateHelper = require('../helper/date-helper.js');
const payrollHelper = require('../helper/payroll-helper.js');

/**
 * @description
 *  Main entry to upload time report:
 *    1. Validate a report with the same id was not already uploaded
 *    2. For each entry, calculate the amount paid, based on number of hours
 *    worked and job group, and the payroll date, either the 15th or the end of
 *    the month.
 *    3. For each entry, insert into the payrolls table.
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
        options["report_id"] = report_id;
        return callback(null);
      }
    });
  }).catch(function (err) {
    return callback(err, 500);
  });
}

/**
 * @description: Parse the given time report file and insert into the payrolls
 * table accordingly. For each entry, calculate the amount paid, based on number of
 * hours worked and job group, and the payroll date, either the 15th or the
 * end of the month. For each entry, insert into the payrolls table accordingly.
 *
 * @param options {timeReportFile}
 * @param callback
 */
function validateTimeReportFile(options, callback) {
  logger.debug("parsing time report file and updating payrolls table");
  const parse_options = {delimiter: ',',
                         // skip header line
                         from: 2,
                         skip_lines_with_empty_values: true};
  var parser = parse(parse_options, function (err, data) {
    data.forEach(function(line) {
        // skip footer line
        if (line[0] !== 'report id') {
          var update_entry = {"empid": line[2]}
          dateHelper.convertDateToPayrollDate(line[0], function(err, res) {
            update_entry["pay_period"] = res;
          });
          const opts = {"hours_worked": line[1], "job_group": line[3]};
          payrollHelper.convertHoursWorkedToCompensation(opts, function(err, res) {
            update_entry["amount_paid"] = res;
          });
          update_entry["report_id"] = options["report_id"];
          dbrouter.insertIntoPayrollsReport(update_entry, function(err, res) {
            if (err) {
              return callback(err, 500);
            }
          });
        }
    });
  });

  let stream = fs.createReadStream(options.timeReportFile).pipe(parser);

  stream.on('end', () => {
    return callback(null, "Successfully uploaded time report!");
  });
}
