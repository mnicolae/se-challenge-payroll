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
  //client.query('SELECT * FROM PAYROLLS;', (err, res) => {
  //  logger.debug(err, res)
  //  client.end()
  //});

  return callback(null, "Placeholder for now");
}
