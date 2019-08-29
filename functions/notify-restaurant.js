'use strict';

const co = require('co');
const notify = require('../lib/notify');
const retry = require('../lib/retry');
const getRecords = require('../lib/kinesis').getRecords;

module.exports.handler = co.wrap(function* (event, context, cb) {
    let records = getRecords(event);
    let orderPlaced = records.filter(r => r.eventType === 'order_placed');

    for (let order of orderPlaced) {
        try {
            yield notify.restaurantOfOrder(order);
        } catch(err) {
            yield retry.restaurantNotification(order);
        }
    }

    cb(null, 'all done');
});