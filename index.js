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

var gulpGithooks = {
	version: '0.1.1'
};
gulpGithooks.hooks = [
    //Committing-Workflow Hooks
    'pre-commit',
    'prepare-commit-msg',
    'commit-msg',
    'post-commit',
    //Email Workflow Hooks
    'applypatch-msg',
    'pre-applypatch',
    'post-applypatch',
    //Other Client Hooks
    'pre-rebase',
    'post-rewrite',
    'post-checkout',
    'post-merge',
    'pre-push',
    'pre-auto-gc',
    //Server-Side Hooks
    'pre-receive',
    'update',
    'post-receive'
];
gulpGithooks.inArray = function(needle, arr) {
    if (typeof arr === 'object' && arr.constructor === Array) {
        for (var i = 0, imax = arr.length; i < imax; i++) {
            if (needle == arr[i]) {
                return true;
            }
        }
    }
    return false;
};
//WalkDir: copy from http://stackoverflow.com/questions\
///22149966/iterating-over-directories-with-gulp
gulpGithooks.walkDir = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walkDir(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};
gulpGithooks.chkExist = function(trg, cb) {
    fs.stat(trg, function(err, stat) {
        if (err === null) {
            if (typeof cb === 'function') cb(null, stat);
        } else {
            //console.log('Please make sure the target is existed.');
            if (typeof cb === 'function') cb(err, stat);
        }
    });
};
gulpGithooks.sync = function(dirname) {
    var _this = this;
    var _dirname = (typeof dirname === 'string') ? dirname : 'githooks';
    //Check all hooks at: https://git-scm.com/book/en/\
    //v2/Customizing-Git-Git-Hooks
    _this.chkExist(process.env.PWD + '/.git/hooks/', function(err, data) {
        if (err) {
            console.error('The directory ./.git/hooks not existed: ' + err.toString());
        } else {
            _this.walkDir(process.env.PWD + '/' + _dirname, function(err, files) {
                if (err) {
                    console.error('Failed to list ./' + _dirname + ': ' + err.toString());
                } else {
                    files.map(function(fn, i) {
                        if (fn.match(/([^\/]+)$/i)) {
                            var rfn = RegExp.$1;
                            if (_this.inArray(rfn, _this.hooks)) {
                                gulp.src([fn]).pipe(
                                    gulp.dest(process.env.PWD + '/.git/hooks/')
                                );
                                console.log("\tCopy file [" + rfn + "] to .git/hooks ");
                            } else {
                                console.error('Invalid .git hookfile: ' + fn);
                            }
                        } else {
                            console.error('Invalid .git hookfile: ' + fn);
                        }
                    });
                }
            });
        }
    });
};
//sync();

exports.gulpGithooks = gulpGithooks;
exports.sync = gulpGithooks.sync;
