'use strict';

const cloudwatch = require('../lib/cloudwatch');

module.exports = (config) => {
  return {
    after: (handler, next) => {
        cloudwatch.flush().then(_ => next());
    },
    onError: (handler, next) => {
        cloudwatch.flush().then(_ => next(handler.error));
    }
  };
};