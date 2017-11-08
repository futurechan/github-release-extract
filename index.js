const Lib = require('./lib')

var argv = require('minimist')(process.argv.slice(2));

console.log(argv);

const instance = new Lib({
        startVersion: argv.s,
        endVersion: argv.e
    }, argv.t, argv.o, argv.r)

instance.run();