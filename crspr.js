/**
 * Created by anthony on 24/01/2017.
 */

/*** A-START ***/
/*** T-END ***/

var preGlobals = [
    ['Path', 'path'],
    ['Url', 'url'],
    ['Promise', 'bluebird'],
    ['Enum', 'enum'],
    ['FS', 'fs']
];

var util = require('util');
var path = require('path');

function crspr(startTag, endTag, replaceMent) {

    replaceMent = replaceMent || preGlobals.map(function (pair) {
            var asName = pair[0], moduleName = pair[1];
            return util.format('global[\'%s\'] = require(\'%s\');', asName, moduleName);
        });

    startTag = startTag || "/*** A-START ***/";
    endTag = endTag || "/*** T-END ***/";

    console.log('REPLACEMENT:', replaceMent.join('\n'));

    var mePath = process.argv[1];

    console.log('me file:', mePath);

    var fs = require('fs');

    var lineReader = require('readline').createInterface({
        input: fs.createReadStream(mePath)
    });

    var newFileLines = [];

    var startMarkerSeen = false, endMarkerSeen = false, unmodified = true;
    lineReader.on('line', function (line) {
        //console.log('Line from file:', line);

        var trimmedLine = line.trim();
        endMarkerSeen = trimmedLine === endTag;

        if(!startMarkerSeen && !endMarkerSeen){
            newFileLines.push(line);
        }

        if(startMarkerSeen && endMarkerSeen && unmodified){
            replaceMent.forEach(function(newLine){
                console.log('adding repcement:', newLine);
                newFileLines.push(newLine);
            });
            unmodified = false;
        }

        if(startMarkerSeen && !endMarkerSeen){
            //skip
        }

        if(endMarkerSeen && !unmodified){
            newFileLines.push(line);
        }

        startMarkerSeen = trimmedLine === startTag;
    });

    lineReader.on('close', function () {
        fs.writeFileSync(mePath, newFileLines.join('\n'));
        console.log('wrote file');
    });

}

if(!module.parent){
    crspr();
}

module.exports = crspr;