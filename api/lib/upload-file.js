'use strict';

const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const config = require('../../config/config').getconfig();
const uploadPath = path.join(__dirname, "../..", config.uploadDir);

const logger = require('log4js').getLogger();
logger.level = config.logLevel;

/**
 * Upload a file through formidable.
 * @param req #request object
 * @param callback
 */
exports.uploadFile = function uploadFile(req, callback) {
  // Create formidable form and set default fields and initialize variables.
  let form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = uploadPath;
  form.keepExtensions = true;

  let timeReportPath = '';

  form.on('fileBegin', (name, file) => {
    timeReportPath = file.path;
  });

  // Emitted when there is an error processing the incoming form.
  // A request that experiences an error is automatically paused,
  // you will have to manually call request.resume() if you want
  // the request to continue.
  form.on('error', (err) => {
    logger.error('upload-file.js:uploadFile():form.on(\'error\'):' + err);
    req.resume();
  });

  // Emitted when the request was aborted by the user. Right now
  // this can be due to a 'timeout' or 'close' event on the socket.
  // After this event is emitted, an error event will follow.
  form.on('aborted', () => {
    logger.error('upload-file.js:uploadFile():form.on(\'aborted\'):');
  });

  // Parse the incoming request containing form data, all fields and files
  // are collected and passed to the callback.
  form.parse(req, (err, fields, files) => {
    if (!timeReportPath) {
      return callback(new Error('Missing the file to upload.'),
        {timeReportPath: timeReportPath});
    }
    // If we don't have err, pass the form information to request.
    if (err) {
      logger.debug(err);
      return callback(err, {timeReportPath: timeReportPath});
    }
    return callback(null, {files: files, body: fields});
  });
};
