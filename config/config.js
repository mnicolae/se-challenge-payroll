/******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ******************************************************************************/
'use strict';

const configs = require('./config.json');

/**
 * @description
 *  Expose configurations from environment variables and config.json,
 *  if an environment variable is set, it overwrites the value in
 *  the json file.
 *
 */
module.exports.getconfig = function () {
  configs.logsLevel = process.env.logsLevel || configs.logsLevel;
  return configs;
};
