var getIP = require("./getIP");
var fs = require('fs');

module.exports = function (content, weinreConfig) {
    return new Promise((resolve, reject) => {
        if (weinreConfig && weinreConfig.open) {
            var weinreScript = '<script src="http://'+ getIP +':'+ weinreConfig.port +'/target/target-script-min.js#anonymous"></script>'
            content += weinreScript;
            resolve(content);
        }
        else {
            resolve(content);
        }
    })
}