var getIP = require("./getIP");
var weinre = require('weinre');

module.exports = function (conf) {
    if (conf && conf.open) {
        var weinrePort = conf.port || 8080;
        weinre.run({
            httpPort: weinrePort,
            boundHost: getIP,
            verbose: false,
            debug: false,
            readTimeout: 5,
            deathTimeout: 15
        });
    }
}