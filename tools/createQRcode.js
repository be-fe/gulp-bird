const cheerio = require('cheerio');
var EventEmitter = require('events').EventEmitter;
var getIP = require("./getIP");
var QRCode = require('qrcode');

/**
 * ext: 生成二维码
 */
module.exports = function (content, dir) {
    return new Promise((resolve, reject) => {
        const ip = "http://" + getIP + ":" + dir;
        QRCode.toDataURL(ip, function (err, url) {
            
            const qrImg = `<div class="bird-tools_qrcode-content" style="display:none"><img src="${url}"></div>`;

            const icon = '<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><defs><style/></defs><path d="M131.176 610.808H63.964V946.87h403.274v-67.213H131.176v-268.85zm0-470.49h336.062V73.103H63.964V409.17h67.212V140.316zm761.745 739.34H556.857v67.212h403.277V610.808H892.92v268.85zm0-806.554H556.857v67.213H892.92V409.17h67.213V73.103H892.92zM63.965 543.594h896.17V476.38H63.964v67.215z" fill="#fff"/></svg>';

            const $ = cheerio.load('<li class="bird-tools__item bird-tools_qrcode"><a class="bird-tools__btn_qrcode" href="javascript:void(0)"></a></li>');
            $('.bird-tools__btn_qrcode').append(icon);
            $('.bird-tools_qrcode').append(qrImg);
            

            content += $.html();
            resolve(content);
        })
    });
}