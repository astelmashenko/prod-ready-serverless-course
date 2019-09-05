'use strict';

const co = require('co');
const AWSXray    = require('aws-xray-sdk')
const AWS        = AWSXray.captureAWS(require('aws-sdk'));
const sns = new AWS.SNS();
const cloudwatch = require('./cloudwatch');

const retaurantRetryTopicArn = process.env.restaurant_notification_retry_topic

let retryRestaurantNotification = co.wrap(function* (order) {
    let pubReq = {
        Message: JSON.stringify(order),
        TopicArn: retaurantRetryTopicArn
    };

    yield cloudwatch.trackExecTime(
        'SnsPublishLatency',
        () => sns.publish(pubReq).promise()
    );

    console.log(`order [${order.orderId}]: queued restaurant notificatoon for retry`);
    cloudwatch.incrCount('NotifyRestaurantQueued');
});

module.exports = {
    restaurantNotification: retryRestaurantNotification
}