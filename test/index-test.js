/*
 * gulp-githooks
 * https://github.com/zhaiduo/gulp-githooks
 *
 * Licensed under the MIT license.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var chai = require('chai');

var copyToGithooks = require('../index.js');
//copyToGithooks.sync();
//console.log('copyToGithooks', copyToGithooks.gulpGithooks.inArray);

describe('gulpGithooks.', function() {
    describe('inArray', function() {
        it('should be OK', function() {
            chai.assert.equal(copyToGithooks.gulpGithooks.inArray('b', ['a', 'b', 'c']), true);
            chai.assert.equal(copyToGithooks.gulpGithooks.inArray('B', ['a', 'b', 'c']), false);
            chai.assert.equal(copyToGithooks.gulpGithooks.inArray('b', undefined), false);
            chai.assert.equal(copyToGithooks.gulpGithooks.inArray(null, ['a', 'b', 'c']), false);
        });
    });

    describe('walkDir', function() {
        it('should be OK', function() {
            copyToGithooks.gulpGithooks.walkDir(process.env.PWD + '/githooks',
                function(err, files) {
                    chai.assert.equal(files, ['pre-commit']);
                });
        });
    });

    describe('chkExist', function() {
        it('should be OK', function() {
            copyToGithooks.gulpGithooks.chkExist(process.env.PWD + '/githooksnotexist',
                function(err, data) {
                    chai.assert.equal(data.hasOwnProperty('errno'), true);
                });
            copyToGithooks.gulpGithooks.chkExist(process.env.PWD + '/githookss',
                function(err, data) {
                    chai.assert.equal(data.hasOwnProperty('atime'), true);
                });
        });
    });

    describe('sync', function() {
        this.timeout(3000);
        it('should be OK', function(done) {
            copyToGithooks.gulpGithooks.sync('githooks');
            setTimeout(done, 1000);
        });
        //ref: https://mochajs.org/#timeouts
        it('should copy files to .git/hooks', function(done) {
            copyToGithooks.gulpGithooks.chkExist(process.env.PWD + '/.git/hooks/',
                function(err, data) {
                    chai.assert.equal(data.hasOwnProperty('atime'), true);
                });
            setTimeout(done, 2000);
        });
    });
});
