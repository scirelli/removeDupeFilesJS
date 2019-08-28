const fs = require('fs'),
    path = require('path');


module.exports = function() {
    const visitors = {};

    return {
        on:  on,
        run: run
    };

    function run(argPath) {
        let self = this;

        return new Promise((resolve)=> {
            let promises = [];
            fs.readdir(argPath, function(err, items) {
                for(let i=0, p=''; i<items.length; i++) {
                    p = path.join(argPath, items[i]);

                    try {
                        if(fs.lstatSync(p).isDirectory()) {
                            notify('directory', p);
                            promises.push(self.run(p));
                            continue;
                        }

                        notify('new', p);
                    }catch(e) {
                        notify('error', e);
                    }
                }
                notify('dirComplete', argPath);
                resolve(Promise.all(promises));
            });
        }).then(()=>{
            notify('complete');
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
