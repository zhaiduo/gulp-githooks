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
                    chai.assert.equal(files[0], 'pre-commit');
                });
        });
    });

    describe('chkExist', function() {
        this.timeout(2000);
        it('should be not existed', function(done) {
            copyToGithooks.gulpGithooks.chkExist(process.env.PWD + '/githooksnotexist',
                function(err, data) {
                    chai.assert.equal(err.hasOwnProperty('errno'), true);
                });
            setTimeout(done, 1000);
        });
        it('should be existed', function(done) {
            copyToGithooks.gulpGithooks.chkExist(process.env.PWD + '/githooks',
                function(err, data) {
                    chai.assert.equal(data.hasOwnProperty('atime'), true);
                });
            setTimeout(done, 1000);
        });
    });

    describe('findHomeDir', function() {
        it('should be OK', function() {
            chai.assert.equal(copyToGithooks.gulpGithooks.findHomeDir('/Home/apps/test-app', 'test-app'), '/Home/apps/test-app');
        });

        it('should be in parent directory', function() {
            chai.assert.equal(copyToGithooks.gulpGithooks.findHomeDir('/Home/apps/test-app/node_modules', 'test-app'), '/Home/apps/test-app');
        });
    });

    describe('sync', function() {
        this.timeout(4000);
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
            setTimeout(done, 1000);
        });
        it('should copy [pre-commit] to .git/hooks', function(done) {
            copyToGithooks.gulpGithooks.chkExist(process.env.PWD + '/.git/hooks/pre-commit',
                function(err, data) {
                    chai.assert.equal(data.hasOwnProperty('atime'), true);
                });
            setTimeout(done, 1000);
        });
    });
});
