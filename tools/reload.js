const cheerio = require('cheerio');
var getIP = require("./getIP");
var QRCode = require('qrcode');

/**
 * ext: 强制刷新
 */
module.exports = function (content) {
    return new Promise((resolve, reject) => {
        const $ = cheerio.load('<li class="bird-tools__item bird-tools_reload"><a class="bird-tools__btn_reload" href="javascript:void(0)" onclick="window.location.reload(true)"></a></li>');

        const icon = '<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><defs><style/></defs><path d="M913.312 384.09H732.144c-23.112 0-41.807-18.728-41.807-41.81 0-23.08 18.696-41.808 41.807-41.808h72.728c-65.604-92.7-173.484-153.296-295.704-153.296-200.114 0-362.338 162.225-362.338 362.336 0 200.113 162.224 362.338 362.338 362.338 200.113 0 362.337-162.225 362.337-362.338 0-23.08 18.695-41.807 41.807-41.807 23.082 0 41.81 18.727 41.81 41.807 0 246.293-199.68 445.954-445.954 445.954-246.277 0-445.955-199.66-445.955-445.954 0-246.29 199.678-445.952 445.955-445.952 149.47 0 281.49 73.692 362.337 186.596v-75.108c0-23.083 18.695-41.808 41.807-41.808 23.082 0 41.81 18.725 41.81 41.808V342.28c0 23.082-18.73 41.81-41.81 41.81z" fill="#fff"/></svg>';

        $('.bird-tools__btn_reload').append(icon);
        content += $.html();
        resolve(content);
    })
}