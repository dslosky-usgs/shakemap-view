/* global chai, describe, it */
'use strict';

var expect;

expect = chai.expect;


describe('Testing framework', () => {
    describe('framework loads', () => {
        it('loaded', () => {
            expect(true).to.equal(true);
        });
    });
});
