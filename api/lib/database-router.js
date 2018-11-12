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

/**
 * @description: Insert a new entry into the payrolls table.
 *
 * @param options {empid, pay_period, amount_paid, report_id}
 * @param callback
 */
exports.insertIntoPayrollsReport = function insertIntoPayrollsReport(options, callback) {
  const query = {text: "insert into payrolls(empid, pay_period, amount_paid, report_id) VALUES($1, TO_DATE($2, 'DD/MM/YYYY'), $3, $4)",
                 values: [options.empid, options.pay_period, options.amount_paid, options.report_id]}

  client.query(query, (err, res) => {
    if (err) {
      logger.debug(err);
      return callback(err, 500);
    } else {
      return callback();
    }
    client.end()
  });
}
