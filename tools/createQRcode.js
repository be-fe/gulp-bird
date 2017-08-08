var fs = require('fs');
var getIP = require("./getIP");
var QRCode = require('qrcode');

/**
 * ext: 文件名称
 * conf：配置信息，true和false
 */
module.exports = function (realPath, ext, res, conf) {
    if (conf && ext === 'html') {
        var content = fs.readFileSync(realPath, "utf-8");
        const ip = getIP;
        var qrImg = '';

        QRCode.toDataURL('I am a pony!', function (err, url) {
            qrImg = '<img src="' + url + '" alt="gulp-bird-qrcode">';
            content = content.replace('</html>', qrImg + '</html>');
        })
            console.log(content)
        

        res.write(content);
        res.end();

        return true;
    }
}