const config = require('../../config/config').getconfig();
const logger = require('log4js').getLogger();
logger.level = config.logLevel;

const end_of_month_map = {1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31,
                          9: 30, 10: 31, 11: 30, 12: 31}

/**
 * @description: Function to map a given date from time report file into its
 * pay period end date.
 *
 * @param date: string in DD/MM/YYYY format
 * @param callback
 */
exports.convertDateToPayrollDate = function convertDatetoPayrollDate(date, callback) {
  // split '10/11/2016' into [10, 11, 2016]
  var date_components = date.split("/");
  date_components.map(parseInt);
  date_components[0] = date_components[0] <= 15 ? 15 : end_of_month_map[date_components[1]];
  let res = date_components[0].toString() + "/" +
            date_components[1].toString() + "/" +
            date_components[2].toString();
  return callback(null, res);
}
