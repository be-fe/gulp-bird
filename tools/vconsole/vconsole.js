var fs = require("fs");
var path = require("path");

module.exports = function (content, weinreConfig) {
    return new Promise((resolve, reject) => {
        if (!weinreConfig.open) {
            const vconsoleScript = '<script>' + fs.readFileSync(path.join(__dirname, '/vconsole.min.js')) + '</script>';
            content += vconsoleScript;
        }
        resolve(content);
    })
}