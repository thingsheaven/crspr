/*** CG-UNI ***/

function crspr(startTag, endTag, lineArgs, transformer) {
    transformer = transformer || DEFAULT_FN;
    startTag = startTag || "/*** A-START ***/";
    endTag = endTag || "/*** T-END ***/";

    if(verbose) console.log('END:', endTag, 'START:', startTag);

    var replaceMent = (lineArgs || preGlobals).map(transformer), mePath = process.argv[1];

    var fs = require('fs'), newFileLines = [], lineNo = 0, lineReader = require('readline').createInterface({
        input: fs.createReadStream(mePath)
    });
    var startMarkerSeen = false, endMarkerSeen = false, bothTagsSeen = false, waitTime = 0, unmodified = {a: true};

    function onLine(line) {
        var trimmedLine = line.trim();
        endMarkerSeen = trimmedLine === endTag;
        startMarkerSeen = trimmedLine === startTag;
        bothTagsSeen = startMarkerSeen && endMarkerSeen;

        if(verbose) console.log('////LINE NUMBER:', lineNo, 'TRIM:' + trimmedLine + '<end>');
        lineNo += 1;
        if (bothTagsSeen) {
            if(verbose) console.log('startMarkerSeen:', startMarkerSeen, 'endMarkerSeen:', endMarkerSeen, 'unmodified:', unmodified,
                'waitTime:', waitTime, 'lines:\n', newFileLines.slice(0, 10).join('\n'), '\ncurrentline:', line);

            newFileLines.push('/*** CG-START ***/');
            if(verbose) console.log('startMarkerSeen:', startMarkerSeen, 'endMarkerSeen:', endMarkerSeen, 'unmodified:', unmodified,
                'waitTime:', waitTime, 'lines:\n', newFileLines.slice(0, 10).join('\n'), '\ncurrentline:\n', line);
        }

        if (startMarkerSeen && endMarkerSeen && unmodified) {
            if(verbose) console.log('startMarkerSeen:', startMarkerSeen, 'endMarkerSeen:', endMarkerSeen, 'unmodified:', unmodified,
                'waitTime:', waitTime, 'lines:\n', newFileLines.slice(0, 10).join('\n'), '\ncurrentline:\n', line);

            replaceMent.forEach(function (newLine) {
                if(verbose) console.log('adding replacement:', newLine);
                newFileLines.push(newLine);
            });

            newFileLines.push('/*** CG-END ***/');
            unmodified.a = false;

            if(verbose) console.log('startMarkerSeen:', startMarkerSeen, 'endMarkerSeen:', endMarkerSeen, 'unmodified:', unmodified,
                'waitTime:', waitTime, 'lines:\n', newFileLines.slice(0, 10).join('\n'), '\ncurrentline:\n', line);
        }

        if (!startMarkerSeen && !endMarkerSeen) {
            if(verbose) console.log('startMarkerSeen:', startMarkerSeen, 'endMarkerSeen:', endMarkerSeen, 'unmodified:', unmodified,
                'waitTime:', waitTime, 'lines:\n', newFileLines.slice(0, 10).join('\n'), '\ncurrentline:\n', line);
            newFileLines.push(line);
            if(verbose) console.log('startMarkerSeen:', startMarkerSeen, 'endMarkerSeen:', endMarkerSeen, 'unmodified:', unmodified,
                'waitTime:', waitTime, 'lines:\n', newFileLines.slice(0, 10).join('\n'), '\ncurrentline:\n', line);
        }

        if (startMarkerSeen && !endMarkerSeen) {
            if(verbose) console.log('startMarkerSeen:', startMarkerSeen, 'endMarkerSeen:', endMarkerSeen, 'unmodified:', unmodified,
                'waitTime:', waitTime, 'lines:\n', newFileLines.slice(0, 10).join('\n'), '\ncurrentline:\n', line);
            waitTime += 1;
            if(verbose) console.log('startMarkerSeen:', startMarkerSeen, 'endMarkerSeen:', endMarkerSeen, 'unmodified:', unmodified,
                'waitTime:', waitTime, 'lines:\n', newFileLines.slice(0, 10).join('\n'), '\ncurrentline:\n', line);
        }

        if (endMarkerSeen && !unmodified) {
            if(verbose) console.log('startMarkerSeen:', startMarkerSeen, 'endMarkerSeen:', endMarkerSeen, 'unmodified:', unmodified,
                'waitTime:', waitTime, 'lines:\n', newFileLines.slice(0, 10).join('\n'), '\ncurrentline:\n', line);
            newFileLines.push(line);
            if(verbose) console.log('startMarkerSeen:', startMarkerSeen, 'endMarkerSeen:', endMarkerSeen, 'unmodified:', unmodified,
                'waitTime:', waitTime, 'lines:\n', newFileLines.slice(0, 10).join('\n'), '\ncurrentline:\n', line);
        }
    }


    lineReader.on('line', onLine);

    lineReader.on('close', function () {
        fs.writeFileSync(mePath, newFileLines.join('\n'));
        console.log('wrote file: waitTime=', waitTime);
    });


    console.log('REPLACEMENT:');
    replaceMent.forEach(function join(item) {
        console.log('\t', item);
    });


}

var preGlobals = [
    ['Path', 'path'],
    ['Url', 'url'],
    ['Promise', 'bluebird'],
    ['Enum', 'enum'],
    ['FS', 'fs']
];

var util = require('util');
var path = require('path');
var verbose = false;
function DEFAULT_FN(args) {
    var asName = args[0], moduleName = args[1];
    return util.format('global[\'%s\'] = require(\'%s\');', asName, moduleName);
}

crspr.v1 = crspr; //backwards compatibility
crspr.v2 = crspr;

var case1 = [];
var case2 = ['/*** CG-UNI ***/', '/*** CG-UNI ***/'];

if (!module.parent) {
    //crspr(case1[0], case1[1], case1[2]);
    verbose = true;
    crspr(case2[0], case2[1]);
    //console.log('s', [1,2,3,4,5].slice(0, 3));
}

module.exports = crspr;