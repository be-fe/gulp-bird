const cheerio = require('cheerio');
var fs = require("fs");
var path = require("path");

/**
 * ext: 强制刷新
 */
module.exports = function (content) {
    return new Promise((resolve, reject) => {
        const $ = cheerio.load(fs.readFileSync(path.join(__dirname ,'/reload.html')), "utf-8");
        content += $.html();
        resolve(content);
    })
}