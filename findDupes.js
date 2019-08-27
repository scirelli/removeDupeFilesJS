const fs = require('fs'),
    child_process = require('child_process'),
    execSync = child_process.execSync,
    path = require('path');


module.exports = function() {
    const hashTable = {},
        visitors = {};

    return {
        on:  on,
        run: run
    };

    function run(argPath) {
        let self = this;

        return new Promise((resolve)=> {
            let promises = [];
            fs.readdir(argPath, function(err, items) {
                for(let i=0, p='', r='', hash=''; i<items.length; i++) {
                    p = path.join(argPath, items[i]);

                    try {
                        if(fs.lstatSync(p).isDirectory()) {
                            promises.push(self.run(p));
                            continue;
                        }

                        r = execSync('md5sum -q "' + p + '"').toString();
                        //r = r.split(' ')[0];
                        hash = r.trim();

                        if(!hashTable[hash]) {
                            hashTable[hash] = [p];
                            notify('newHash', p, hash);
                        }else {
                            hashTable[hash].push(p);
                            notify('dupHash', hashTable[hash], hash);
                        }
                    }catch(e) {
                        notify('error', e);
                    }
                }
                notify('dirComplete', argPath);
                resolve(Promise.all(promises));
            });
        }).then(()=>{
            notify('complete', hashTable);
            return hashTable;
        });
    }

    function notify(eventName) {
        if(!visitors[eventName]) return;

        let args = Array.prototype.slice.call(arguments, 1);

        for(let handler of visitors[eventName]) {
            handler.apply(handler, args);
        }
    }

    function on(eventName, handler) {
        if(visitors[eventName]) {
            visitors[eventName].push(handler);
        }else{
            visitors[eventName] = [handler];
        }

        return this;
    }
};
