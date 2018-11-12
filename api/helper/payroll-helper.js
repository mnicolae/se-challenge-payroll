const config = require('../../config/config').getconfig();
const logger = require('log4js').getLogger();
logger.level = config.logLevel;

const payment_map = {"A": 20,
                     "B": 30};

/**
 * @description: Function to map the number of hours worked for a given job
 * group to the total payment.
 *
 * @param {hours_worked, job_group}
 * @param callback
 */
exports.convertHoursWorkedToCompensation = function convertHoursWorkedToCompensation(options, callback) {
  return callback(null, options.hours_worked * payment_map[options.job_group]);
}
