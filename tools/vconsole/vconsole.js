var fs = require("fs");
var path = require("path");

module.exports = function (content) {
  return new Promise((resolve, reject) => {
    const vconsoleScript = '<script>' + fs.readFileSync(path.join(__dirname, '/vconsole.min.js')) + '</script>';
    content += vconsoleScript;
    resolve(content);
  })
}