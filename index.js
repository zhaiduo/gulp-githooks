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
var chmod = require('gulp-chmod');

var gulpGithooks = {
    version: process.env.npm_package_version,
    name: process.env.npm_package_name
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
gulpGithooks.findHomeDir = function(pwd, name) {
    var _pwd = (typeof pwd === 'string') ? pwd : process.env.PWD;
    var _name = (typeof name === 'string') ? name : gulpGithooks.name.replace(/[^0-9a-z_\-]/ig, "");
    var reg = new RegExp(_name.replace(/"\/"+([\-])/ig, "\\$1") + "$", "");
    var regOther = new RegExp("^(.*)\/" + _name.replace(/"\/"+([\-])/ig, "\\$1") + "\/(.*)$", "");
    if (_pwd.match(reg)) {
        return _pwd;
    } else {
        if (_pwd.match(regOther)) {
            return RegExp.$1 + '/' + _name;
        } else {
            return null;
        }
    }
};
gulpGithooks.sync = function(dirname, homeDirname) {
    var _dirname = (typeof dirname === 'string') ? dirname.replace(/[^0-9a-z]/ig, "") : 'githooks';
    var _homeDirname = (typeof homeDirname === 'string') ? homeDirname.replace(/[^0-9a-z_\-]/ig, "") : process.env.npm_package_name;
    var appHome = gulpGithooks.findHomeDir(process.env.PWD, _homeDirname);
    if (appHome === null) {
        console.warn("\tFailed to find the home directory when copy git hook file.");
        appHome = process.env.PWD;
    }
    //Check all hooks at: https://git-scm.com/book/en/\
    //v2/Customizing-Git-Git-Hooks
    gulpGithooks.chkExist(appHome + '/.git/hooks/', function(err, data) {
        if (err) {
            console.error('The directory ./.git/hooks not existed: ' + err.toString());
        } else {
            gulpGithooks.walkDir(process.env.PWD + '/' + _dirname, function(err, files) {
                if (err) {
                    console.error('Failed to find ./' + _dirname + ' in PWD: ' + err.toString());
                } else {
                    files.map(function(fn, i) {
                        if (fn.match(/([^\/]+)$/i)) {
                            var rfn = RegExp.$1;
                            if (gulpGithooks.inArray(rfn, gulpGithooks.hooks)) {
                                gulp.src([fn]).pipe(chmod(0o755)).pipe(
                                    gulp.dest(appHome + '/.git/hooks/')
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
