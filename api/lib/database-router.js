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
 * @description
 * TBD.
 *
 * @param options
 * @param callback
 */
exports.selectPayrollReport = function selectPayrollReport(options, callback) {
  logger.debug("reading payroll report from database");
  const query_text = 'select empid, pay_period, amount_paid from payrolls ' +
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
