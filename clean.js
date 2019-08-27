#!/usr/bin/env node

const trav = require('./traverse'),
    traverser = trav();

if(process.argv.length <= 2) {
    console.log('Usage: ' + __filename + ' path/to/directory');
    process.exit(-1);
}

traverser.on('newHash', (path, hash)=> {
    process.stdout.write('New \t' + path + '\t' + hash + '\n');
}).on('dupHash', (path, hash)=> {
    process.stdout.write('Dupe! \t' + path + '\t' + hash + '\n');
}).on('error', (e)=>{
    process.stderror.write(e);
}).on('dirComplete', (argPath)=>{
    process.stdout.write('### DIR Traverse Complete ###\t' + argPath);
}).run(process.argv[2]).then((hashTable)=>{
    let dupes = [];

    Object.values(hashTable).forEach(v=> {
        if(v.length > 1) {
            dupes.push(v);
        }
    });

    //console.log(dupes.join('\n\n'));
    console.log(dupes.length);
    return dupes;
});
