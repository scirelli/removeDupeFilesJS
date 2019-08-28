#!/usr/bin/env node
const GENESIS_ROMS_DB = './database/Sega - Mega Drive - Genesis (20190821-120528).dat',
    ROMs_UNKNOWN = '/tmp/Sega_Genesis/ROMs_Unknown';

const fs = require('fs'),
    path = require('path'),
    trav = require('./traverse'),
    child_process = require('child_process'),
    execSync = child_process.execSync,
    traverser = trav(),
    parser = require('fast-xml-parser');

if(process.argv.length <= 2) {
    console.log('Usage: ' + __filename + ' path/to/directory');
    process.exit(-1);
}

let jsonObj = parser.parse(fs.readFileSync(GENESIS_ROMS_DB).toString(), {
    parseAttributeValue: true,
    ignoreAttributes:    false
}).datafile.game.reduce((accum, item)=> {
    accum[item.rom['@_md5']] = item;
    return accum;
}, {});

traverser.on('new', (filePath)=> {
    let hash = execSync('md5sum -q "' + filePath + '"').toString().trim().toUpperCase(),
        romInfo = jsonObj[hash],
        dest = '';

    if(!romInfo) {
        process.stderr.write(filePath + '\n');
        dest = path.join(ROMs_UNKNOWN, path.basename(filePath));
    }else{
        process.stdout.write(filePath + '\n');
        dest = path.join(path.dirname(filePath), romInfo.rom['@_name']);
    }

    fs.rename(filePath, dest, (err) => {
        if(err) console.error(err);

        process.stdout.write('Renamed: \t\'' + filePath + '\' to\tDest: \'' + dest + '\'\n');
    });
}).on('error', (e)=>{
    process.stderr.write(e);
}).on('dirComplete', (argPath)=>{
    process.stdout.write('\n\n### DIR Traverse Complete ###\t' + argPath);
}).run(process.argv[2]).then(()=>{
    process.stdout.write('DONE!');
});
