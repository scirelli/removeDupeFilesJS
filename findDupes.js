const child_process = require('child_process'),
    execSync = child_process.execSync,
    traverser = require('./traverse')();


module.exports = function() {
    const hashTable = {},
        visitors = {};

    return {
        on:  on,
        run: run
    };

    function run(argPath) {
        traverser.on('new', (filePath)=> {
            try {
                let hash = execSync('md5sum -q "' + filePath + '"').toString().trim();

                if(!hashTable[hash]) {
                    hashTable[hash] = [filePath];
                    notify('newHash', filePath, hash);
                }else {
                    hashTable[hash].push(filePath);
                    notify('dupHash', hashTable[hash], hash);
                }
            }catch(e) {
                notify('error', e);
            }
        }).on('complete', ()=> {
            notify('complete', hashTable);
        }).on('error', (e)=>{
            notify('error', e);
        });

        return traverser.run(argPath).then((hashTable)=>{
            return hashTable();
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
