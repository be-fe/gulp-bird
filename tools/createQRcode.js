var fs = require('fs');
var URL = require('url');
var getIP = require("./getIP");
var QRCode = require('qrcode');

/**
 * ext: 文件名称
 * conf：配置信息，true和false
 */
module.exports = function (realPath, ext, res, conf, dir) {
    if (!conf || ext !== 'html') {
        return false;
    }
    const ip = "http://" + getIP + ":" + dir;
    let content = fs.readFileSync(realPath, "utf-8");

    QRCode.toDataURL(ip,  (err, url) => {
        const qrImg = '<img src="' + url + '">';
        content = content.replace('</html>', qrImg + '</html>');
        res.write(content);
        res.end();
    })
    return true;
}