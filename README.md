# node-red-contrib-advanced-mopidy

**Work in progress**

[![Build Status](https://travis-ci.org/emiloberg/node-red-contrib-advanced-mopidy.svg?branch=master)](https://travis-ci.org/emiloberg/node-red-contrib-advanced-mopidy)
[![Dependency Status](https://gemnasium.com/emiloberg/node-red-contrib-advanced-mopidy.svg)](https://gemnasium.com/emiloberg/node-red-contrib-advanced-mopidy)
[![Test Coverage](https://codeclimate.com/github/emiloberg/node-red-contrib-advanced-mopidy/badges/coverage.svg)](https://codeclimate.com/github/emiloberg/node-red-contrib-advanced-mopidy/coverage)
[![Code Climate](https://codeclimate.com/github/emiloberg/node-red-contrib-advanced-mopidy/badges/gpa.svg)](https://codeclimate.com/github/emiloberg/node-red-contrib-advanced-mopidy)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/emiloberg/node-red-contrib-advanced-mopidy.svg)](http://isitmaintained.com/project/emiloberg/node-red-contrib-advanced-mopidy "Average time to resolve an issue")
[![Percentage of issues still open](http://isitmaintained.com/badge/open/emiloberg/node-red-contrib-advanced-mopidy.svg)](http://isitmaintained.com/project/emiloberg/node-red-contrib-advanced-mopidy "Percentage of issues still open")

## Install
While in development, you need to clone and `npm install` it. Will be on NPM when stable.
    

## Development
This is coded in ES2015. To make older node able to understand it, it has to be transpiled to ES5. This is done automagically on installation.

To rebuild it yourself, please see the tasks below.

The source lives in the `./src` folder and gets transpiled and copied to the `./mopidy` folder.

### Pre commit
There's a pre-commit hook in place which will run tests and lint check (`npm test` and `npm runt lint`) on ommit. Failed tests or lints will prevent commit.

### Development tasks
Run tests which __do not__ require a connected Mopidy server by running:

```
npm test
```

Run tests which __do__ require a connected Mopidy server by running:

```
npm run test-all
```

For linting with eslint, run 

```
npm run lint
```

To auto-run babel and transpile ES2015 to ES5 when files are changed (and copy all non-js files from `/src` to `/mopidy` if they're changed), run:

```
npm run watch
```

To do a complete clean & rebuild, run:

```
npm run clean-build
```