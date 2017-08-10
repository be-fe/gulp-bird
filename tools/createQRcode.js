const cheerio = require('cheerio');
var getIP = require("./getIP");
var QRCode = require('qrcode');

/**
 * ext: 生成二维码
 */
module.exports = function (content, dir) {
    return new Promise((resolve, reject) => {
        const ip = "http://" + getIP + ":" + dir;
        QRCode.toDataURL(ip, function (err, url) {
            const qrImg = '<img src="' + url + '">';
            const $ = cheerio.load('<li class="bird-qrcode">二维码</li>');
            $('.bird-qrcode').append(qrImg);
            content += $.html();
            resolve(content);
        })
    });
}