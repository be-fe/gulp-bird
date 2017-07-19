var getIP = require("./getIP");
module.exports = function(realPath, ext, conf) {
    //weinre
    var weinreConfig = conf;
    if (weinreConfig && weinreConfig.open && ext === 'html') {
        var content = fs.readFileSync(realPath, "utf-8");
        var weinreScript = '<script src="http://'+ getIP +':'+ weinreConfig.port +'/target/target-script-min.js#xieyu"></script>'
        content = content.replace('</html>', weinreScript + '</html>');
        res.write(content);
        res.end();
        return;
    }
}