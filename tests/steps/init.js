'use strict';

const co = require('co');
const aws4 = require('../../lib/aws4');

let initialized = false;

let init = co.wrap(function* () {
    if (initialized) {
        return;
    }

    process.env.restaurants_api = 'https://e7j9901i64.execute-api.us-east-1.amazonaws.com/dev/restaurants';
    process.env.restaurants_table = 'restaurants';
    process.env.AWS_REGION = 'us-east-1';
    process.env.cognito_client_id = 'test_cognito_client_id';
    process.env.cognito_user_pool_id = 'us-east-1_DufZfQABc';
    process.env.cognito_server_client_id = '1qmept7tv5sc60btuq9dhnf714';

    yield aws4.init();

    // console.log('AWS credentials loaded');

    initialized = true; 
});

module.exports.init = init;