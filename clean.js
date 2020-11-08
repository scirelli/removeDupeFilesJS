#!/usr/bin/env node
/*
 * Script that renames cleans ROM names.
 */
const ROMs_UNKNOWN = '/tmp/ROMs_Unknown';

const fs = require('fs'),
    path = require('path'),
    trav = require('./traverse'),
    child_process = require('child_process'),
    execSync = child_process.execSync,
    traverser = trav(),
    parser = require('fast-xml-parser');

if(process.argv.length <= 3) {
    console.log('Usage: ' + __filename + ' path/to/rom/directory path/to/database.dat [path/to/place/unknown/roms]');
    process.exit(-1);
}

let pathToRoms = process.argv[2],
    romDB = process.argv[3],
    pathToPlaceUnknown = process.argv[4] || ROMs_UNKNOWN,
    jsonObj = parser.parse(fs.readFileSync(romDB).toString(), {
        parseAttributeValue: true,
        ignoreAttributes:    false
    }).datafile.game.reduce((accum, item)=> {
        accum[item.rom['@_md5']] = item;
        // accum[item.rom['@_sha1']] = item;
        return accum;
    }, {});

traverser.on('new', (filePath)=> {
    let hash = execSync('md5sum -q "' + filePath + '"').toString().trim().toUpperCase(),
        // hash = execSync('shasum "' + filePath + '"').toString().split(' ')[0].toUpperCase(),
        romInfo = jsonObj[hash],
        dest = '';

    if(!romInfo) {
        process.stderr.write(filePath + '\n');
        dest = path.join(pathToPlaceUnknown, path.basename(filePath));
    }else{
        process.stdout.write(filePath + '\n');
        dest = path.join(path.dirname(filePath), romInfo.rom['@_name']);
    }

    // console.log('ROM Info: ', romInfo);
    // console.log(filePath, dest);
    fs.rename(filePath, dest, (err) => {
        if(err) console.error(err);

        process.stdout.write('Renamed: \t\'' + filePath + '\' to\tDest: \'' + dest + '\'\n');
    });
}).on('error', (e)=>{
    process.stderr.write(e.toString());
}).on('dirComplete', (argPath)=>{
    process.stdout.write('\n\n### DIR Traverse Complete ###\t' + argPath);
}).run(pathToRoms).then(()=>{
    process.stdout.write('DONE!');
});
