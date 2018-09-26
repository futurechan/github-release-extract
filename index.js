const Lib = require('./lib')

var argv = require('minimist')(process.argv.slice(2), { string: ['s', 'e', 'o', 'r', 't']});

console.log(argv);

const instance = new Lib({
        startVersion: argv.s.toString(),
        endVersion: argv.e.toString()
    }, argv.t, argv.o, argv.r)

instance.run();