'use strict';

const co = require('co');
const notify = require('../lib/notify');
const middy = require('middy');
const sampleLogging = require('../middleware/sample-logging');
const flushMetrics = require('../middleware/flush-metrics');

const handler = co.wrap(function* (event, context, cb) {
    let order = JSON.parse(event.Records[0].Sns.Message);
    order.retried = true;

    try {
        yield notify.restaurantOfOrder(order);
        cb(null, 'all done');
    } catch(err) {
        // if the notification fails, we'll fail the invocation as well and let Lambda handle the retry.
        cb(err);
    }
});

module.exports.handler = middy(handler)
    .use(sampleLogging({ sampleRate: 0.01 }))
    .use(flushMetrics);