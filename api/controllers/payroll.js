'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  uploadTimeReport: uploadTimeReport
};

/**
 * @pre
 *  POST /v1/payroll/uploadTimeReprot routes to `uploadTimeReport`.
 *
 * @description
 * Upload a time report.
 *
 * @param req #request object
 * @param res #response object
 */
function uploadTimeReport(req, res) {
  res.status(400);
  return res.json({
    success: false,
    message: 'Hold your horses, this endpoint not implemented yet.'
  });
}
