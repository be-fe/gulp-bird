const cheerio = require('cheerio');
var getIP = require("./getIP");
var QRCode = require('qrcode');

/**
 * ext: 强制刷新
 */
module.exports = function (content) {
    return new Promise((resolve, reject) => {
        const testBtn = '<li><a href="javascript:void(0)" onclick="window.location.reload(true)">刷新</a></li>';
        content += testBtn;
        resolve(content);
    })
}