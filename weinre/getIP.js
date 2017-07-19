var os = require('os');
var getIp = function() {
    var ifaces = os.networkInterfaces();
    var IP;
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;
        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
              return;
            }

            if (alias >= 1) {
              // this single interface has multiple ipv4 addresses
                IP = iface.address
            } else {
              // this interface has only one ipv4 adress
                IP = iface.address
            }
            ++alias;
        });
    });
    return IP;
}

module.exports = getIp();