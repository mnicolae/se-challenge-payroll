const config = require('../../config/config').getconfig();
const logger = require('log4js').getLogger();
logger.level = config.logLevel;

const { Client } = require('pg');

const client = new Client({
  user: config.dbUser,
  host: config.dbHost,
  database: config.dbName,
  password: config.dbPass,
  port: config.dbPort,
});
client.connect();

/**
 * @description: Query the payrolls table.
 *
 * @param options
 * @param callback
 */
exports.selectPayrollReport = function selectPayrollReport(options, callback) {
  logger.debug("reading payroll report from database");
  const query_text = 'select empid, pay_period, sum(amount_paid) from payrolls ' +
                     'group by empid, pay_period ' +
                     'order by empid, pay_period';
  client.query(query_text, (err, res) => {
    if (err) {
      logger.err(err.stack);
    } else {
      return callback(null, res.rows);
    }
    client.end()
  });
}

/**
 * @description: Verify if a particular time report id exists in the
 * payrolls table.
 *
 * @param options {time_report_id}
 * @param callback
 */
exports.timeReportIdExists = function timeReportIdExists(options, callback) {
  logger.debug("verify if time report id " + options.time_report_id + " exists in the database");
  const query_text = 'select report_id from payrolls ' +
                     'where report_id = ' + options.time_report_id;
  client.query(query_text, (err, res) => {
    if (err) {
      return callback(err, 500);
    } else {
      return callback(null, res.rows.length === 0 ? false : true);
    }
    client.end()
  });
}
