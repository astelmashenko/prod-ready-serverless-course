'use strict';

const co = require('co');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const Mustache = require('mustache');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const http = require('superagent-promise')(require('superagent'), Promise)

const restaurantsApiRoot = process.env.restaurants_api;

var html;

function* loadHtml() {
  if (!html) {
    html = yield fs.readFileAsync('static/index.html', 'utf-8');
  }
  return html;
}

function* getRestaurants() {
  return (yield http.get(restaurantsApiRoot)).body;
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
