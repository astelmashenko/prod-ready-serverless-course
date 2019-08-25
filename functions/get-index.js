'use strict';

const co = require('co');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const Mustache = require('mustache');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const http = require('superagent-promise')(require('superagent'), Promise)
const aws4 = require('aws4');
const URL = require('url');

const restaurantsApiRoot = process.env.restaurants_api;

var html;

function* loadHtml() {
  if (!html) {
    html = yield fs.readFileAsync('static/index.html', 'utf-8');
  }
  return html;
}

function* getRestaurants() {
  let url = URL.parse(restaurantsApiRoot);
  let opts = {
    host: url.hostname,
    path: url.pathname
  };

  // console.log(">>> opts", opts);

  aws4.sign(opts);
  
  // console.log(">>> opts signed", opts);

  return (yield http
      .get(restaurantsApiRoot)
      .set('Host', opts.headers['Host'])
      .set('X-Amz-Date', opts.headers['X-Amz-Date'])
      .set('Authorization', opts.headers['Authorization'])
      .set('X-Amz-Security-Token', opts.headers['X-Amz-Security-Token'])
  ).body;
}

module.exports.handler = co.wrap(function* (event) {
  let template = yield loadHtml();
  let restaurants = yield getRestaurants();
  let dayOfWeek = days[new Date().getDay()];
  let html = Mustache.render(template, { restaurants });

  return {
    statusCode: 200,
    body: html,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    }
  };
});
