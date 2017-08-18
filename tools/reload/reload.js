const cheerio = require('cheerio');
var fs = require("fs");

/**
 * ext: 强制刷新
 */
module.exports = function (content) {
    return new Promise((resolve, reject) => {
        const $ = cheerio.load(fs.readFileSync('./tools/reload/reload.html', "utf-8"));
        content += $.html();
        resolve(content);
    })
}