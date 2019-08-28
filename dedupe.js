#!/usr/bin/env node
const fs = require('fs'),
    path = require('path'),
    findDupes = require('./findDupes')(),
    tmpDir = '/tmp/Sega_Genesis2/ROMs';

if(process.argv.length <= 2) {
    console.log('Usage: ' + __filename + ' path/to/directory');
    process.exit(-1);
}

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
}).run(process.argv[2]).then(()=>{
    process.stdout.write('DONE!');
});
