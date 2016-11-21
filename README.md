# gulp-githooks v0.1.8

[![Build Status](https://travis-ci.org/zhaiduo/gulp-githooks.svg?branch=master)](https://travis-ci.org/zhaiduo/gulp-githooks)

> A Gulp plugin to copy all githooks files in ./githooks to .git/hooks automatically.

## Getting Started
This plugin requires at least Gulp `~3.9.0`

If you haven't used [Gulp](http://gulpjs.com/) before, be sure to check out the
[Getting Started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) guide, as it explains how to
create a [Gulpfile](https://github.com/gulpjs/gulp#sample-gulpfilejs) as well as install and
use Gulp plugins. Once you're familiar with that process, you may install this
plugin with this command:

```shell
npm install gulp-githooks --save-dev
```

Once the plugin has been installed, it may be enabled inside your
Gulpfile with this line of JavaScript:

```js
var copyToGithooks = require('gulp-githooks');
//copy githookfiles from ./githooks to ./git/hooks
copyToGithooks.sync();
or
//copy githookfiles from ./another_githooks_directory to ./git/hooks
copyToGithooks.sync('another_githooks_directory');
or
//copy githookfiles from ./githooks to ./yourapp./git/hooks
copyToGithooks.sync('githooks', 'yourapp');
```

### Options

#### dirname
Type: `String`
Defaults: `githooks`

It can also allow you to run another dirname to save the git hookfiles to sync.

#### homeDirname
Type: `String`
Defaults: `process.env.npm_package_name`

It can help you to find where is the home directory.

## Contributing

In lieu of a formal style-guide, take care to maintain the existing coding style.
Please file a Pull Request along your issues.

 * Add unit tests for any new or changed functionality.
 * Lint and test your code using [Gulp](http://gulpjs.com/).
 * Keep the line length at 80-120 characters per line.

### File a Pull Request

The process actually is quite simple:

 1. Please check out your changes on a separate branch named `issue-{$integer}` and commit against that one.
 1. When your tests pass and are green, merge to `dev` using `--no-ff` so we have a separate commit for that merge.
 1. After the review on `dev`, we can merge to `master`, again using `--no-ff`.
 1. The merge to `master` will get tagged. We use the [SemVer standard](http://semver.org), so _no_ leading `v`.

If your PR is successful, you will get added as contributor to the repo. We
trust you after your first PR made it into the repo and you then have access
for further changes, handling issues, etc. So the *important* thing is to add
your name to the `package.json` array of `contributors` when changing or adding
some code for a PR. Please do that in a separate commit.

## Release History

See [Changelog](./CHANGELOG.md) for details or [the Release list](../../releases)
(see [latest](../../releases/latest) for recent updates).
