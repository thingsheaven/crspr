# crspr
Self modifying files toolkit

# Dependencies
No dependencies!

# Installation (node.js)

    $ npm install crspr

# Usage
Replace this;
````js
function registerGlobal(moduleName, asName) {

    if (!global[asName]) {
        console.info('registered global', moduleName, 'as', asName);
        global[asName] = require(moduleName);
    }
}

var preGlobals = [
    ['Path', 'path'],
    ['Url', 'url'],
    ['Promise', 'bluebird'],
    ['Enum', 'enum'],
    ['FS', 'fs']
];

preGlobals.forEach(function(pair){
    registerGlobal(pair[1], pair[0]);
})
````

...with this;
````js
/*** A-START ***/
/*** T-END ***/

var preGlobals = [
    ['Path', 'path'],
    ['Url', 'url'],
    ['Promise', 'bluebird'],
    ['Enum', 'enum'],
    ['FS', 'fs']
];

var crspr = require('crspr');
var util = require('util');
var replaceMentLines = preGlobals.map(function (pair) {
                                         var asName = pair[0], moduleName = pair[1];
                                         return util.format('global[\'%s\'] = require(\'%s\');', asName, moduleName);
                                     });

crspr('/*** A-START ***/', '/*** T-END ***/', replaceMentLines);
````
...run and VOILA!

````js
/*** A-START ***/
globals['Path'] = require('path');
globals['Url'] = require('url');
globals['Promise'] = require('bluebird');
globals['Enum'] = require('enum');
globals['FS'] = require('fs');
/*** T-END ***/

var preGlobals = [
    ['Path', 'path'],
    ['Url', 'url'],
    ['Promise', 'bluebird'],
    ['Enum', 'enum'],
    ['FS', 'fs']
];

var crspr = require('crspr');
var util = require('util');
var replacementLines = preGlobals.map(function (pair) {
                                         var asName = pair[0], moduleName = pair[1];
                                         return util.format('global[\'%s\'] = require(\'%s\');', asName, moduleName);
                                     });

crspr('/*** A-START ***/', '/*** T-END ***/', replacementLines);
````
