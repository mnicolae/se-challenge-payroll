'use strict';

const fs = require('fs');
const path = require('path');

const config = require('../../config/config').getconfig();
const logger = require('log4js').getLogger();
logger.level = config.logLevel;

module.exports = {
  renderPayrollFrontend: renderPayrollFrontend
};

/**
 * @pre
 *  GET / routes to `renderPayrollFrontend`.
 *
 * @description
 * Render the UI components to accept (via a form) a time report file and display
 * a payroll report table.
 *
 * @param req #request object
 * @param res #response object
 */
function renderPayrollFrontend(req, res) {
  // options is empty at the moment, but it could populated later on
  // with items from middleware layer.
  const options = {};

  return res.json({
    success: true,
    message: "I am nothing but a placeholder!"
  });
}
