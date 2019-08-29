'use strict';

const co = require('co');
const notify = require('../lib/notify');

module.exports.handler = co.wrap(function* (event, context, cb) {
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