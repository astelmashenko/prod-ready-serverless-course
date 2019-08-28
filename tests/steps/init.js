'use strict';

const co = require('co');
const Promise = require('bluebird');
const awscred = Promise.promisifyAll(require('../../lib/awscred'));

let initialized = false;

let init = co.wrap(function* () {
    if (initialized) {
        return;
    }

    process.env.restaurants_api = 'https://27phnukza0.execute-api.us-east-1.amazonaws.com/dev/restaurants';
    process.env.restaurants_table = 'restaurants';
    process.env.AWS_REGION = 'us-east-1';
    process.env.cognito_client_id = 'test_cognito_client_id';
    process.env.cognito_user_pool_id = 'us-east-1_DufZfQABc';
    process.env.cognito_server_client_id = '1qmept7tv5sc60btuq9dhnf714';

    if (!process.env.AWS_ACCESS_KEY_ID) {
        let cred = yield awscred.loadAsync();
    
        process.env.AWS_ACCESS_KEY_ID     = cred.credentials.accessKeyId;
        process.env.AWS_SECRET_ACCESS_KEY = cred.credentials.secretAccessKey;

        if (cred.sessionToken) {
            process.env.AWS_SESSION_TOKEN = cred.sessionToken;
        }
    }

    console.log('AWS credentials loaded');

    initialized = true; 
});

module.exports.init = init;