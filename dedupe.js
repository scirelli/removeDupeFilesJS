#!/usr/bin/env node
const fs = require('fs'),
    path = require('path'),
    findDupes = require('./findDupes')(),
    TMP_DIR = '/tmp/ROMs';

if(process.argv.length <= 3) {
    console.log('Scans the given directory and sub-directories, and copies unique files to the specified folder.');
    console.log('Usage: ' + __filename + ' path/to/directory path/to/place/uniqueFiles');
    process.exit(-1);
}

let romsToScan = process.argv[2],
    tmpDir = process.argv[3] || TMP_DIR;

findDupes.on('newHash', (filePath)=> {
    process.stdout.write('New: \t' + filePath + '\n');

    let dest = path.join(tmpDir, path.basename(filePath));

    fs.copyFile(filePath, dest, (err) => {
        if(err) console.error(err);

        process.stdout.write('\tCopied: \t\'' + filePath + '\' to\tDest: \'' + dest + '\'\n');
    });
}).on('dupHash', (filePath, hash)=> {
    process.stdout.write('Dupe! \t' + filePath + '\t' + hash + '\n');
}).on('error', (e)=>{
    process.stderr.write(e);
}).on('dirComplete', (argPath)=>{
    process.stdout.write('\n\n### DIR Traverse Complete ###\t' + argPath);
}).run(romsToScan).then(()=>{
    process.stdout.write('DONE!');
});
