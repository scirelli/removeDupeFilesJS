#!/usr/bin/env node

const fs = require('fs'),
    child_process = require('child_process'),
    exec = child_process.exec,
    execSync = child_process.execSync,
    path = require('path');

var hashTable = {};
 
if(process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/to/directory");
    process.exit(-1);
}
 
var argPath = process.argv[2];
 
fs.readdir(argPath, function(err, items) {
    for (var i=0,p='',r=''; i<items.length; i++) {
        p = path.join(argPath, items[i]);

        try{
            r = execSync('md5 -q "' + p + '"').toString();
            process.stdout.write(r);
            if(!hashTable[r]){
                hashTable[r] = true;
            }else{
                execSync('rm -f "' + p + '"');
                console.log('rm -f "' + p + '"');
            }
        }catch(e){
            console.log(e);
        }

    }
});
