var getIP = require("./getIP");
var fs = require('fs');
module.exports = function(realPath, ext, res, conf) {
    //weinre
    var weinreConfig = conf;
    if (weinreConfig && weinreConfig.open && ext === 'html') {
        var content = fs.readFileSync(realPath, "utf-8");
        var weinreScript = '<script src="http://'+ getIP +':'+ weinreConfig.port +'/target/target-script-min.js#anonymous"></script>'
        content = content.replace('</html>', weinreScript + '</html>');
        res.write(content);
        res.end();
        return true;
    }
}
