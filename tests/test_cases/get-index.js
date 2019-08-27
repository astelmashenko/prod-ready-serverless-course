'use strict';

const co = require('co');
const expect = require('chai').expect;
const when = require('../steps/when');
const init = require('../steps/init').init;
const cheerio = require('cheerio');

describe(`When we invoke GET / endpoint`, co.wrap(function* () {
    before(co.wrap(function*() {
        yield init();
    }));

    it(`Should return the index page with 8 restaurants`, co.wrap(function* () {
        let res = yield when.we_invoke_get_index();

        expect(res.statusCode).to.equal(200);
        expect(res.headers['Content-Type']).to.equal('text/html; charset=UTF-8');
        expect(res.body).to.not.be.null;

        let $ = cheerio.load(res.body);
        let restaurants = $('.restaurant', '#restaurantsUL');
        expect(restaurants.len).to.equal(8);
    }));
}));