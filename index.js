var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var mime = require("./mime").types;
var zlib = require("zlib");
var config = require("./config");
var utils = require("./utils");
var dummyjson = require('dummy-json');
var injectWeinre = require('./tools/injectWeinre.js');
var startWeinre = require('./tools/startWeinre.js');
var matchDirectory = require('./tools/matchDirectory.js'); // 增加匹配目录的功能


const cheerio = require('cheerio');
var toolstart = require('./tools/toolstart.js');
var createQRcode = require('./tools/createQRcode/createQRcode.js');
var reload = require('./tools/reload/reload.js');
var vconsole = require('./tools/vconsole/vconsole.js');

var { NewDate, randomInt, g, generatePattern, randomBetween, generate, parseRange, dummyHelpers } = require('./utils');


var Transpond = require("./transpond");
var transpond = new Transpond().transpond;

var service = function(servers, rules, toolsConf) {
    return function (req, res, next) {
        var port = req.headers.host.split(":")[1] || 80;
        var pathname = url.parse(req.url).pathname;
        var realPath = "";
        if (pathname.slice(-1) === "/") {
            pathname += config.Default.file;
        }
        realPath = path.join(servers[port].basePath, path.normalize(pathname.replace(/\.\./g, "")));

        //匹配忽略列表，若匹配直接抛给回调函数
        if (servers[port].ignoreRegExp && req.url.match(servers[port].ignoreRegExp)) {
            console.log("ignore request:" + req.url);
            if (typeof transpond === "function" && rules) {
                transpond(req, res, rules, next);
            }
            return false;
        }

        var pathHandle = function (realPath) {
            // console.log(realPath);
            fs.stat(realPath, function (err, stats) {
                if (err) {
                    if (typeof transpond === "function" && rules) {
                        transpond(req, res, rules, next);
                    }
                    else {
                        //console.log(req.url + " 404");
                        if (!next) {
                            res.writeHead(404, {
                                "Content-Type": "text/plain"
                            });
                            res.write("This request URL " + pathname + " was not found on this server.");
                            res.end();
                        }
                        else {
                            next();
                        }
                    }

                }
                else {
                    if (stats.isDirectory()) {
                        matchDirectory(req, res, realPath);
                    }
                    else {
                        if (realPath.indexOf('.json') > -1 && !realPath.match('locale')) {
                            // fs.stat( realPath, function (err, stats) {
                            var content = fs.readFileSync(realPath, "utf-8");
                            // res.write(JSON.stringify( {
                            //         code: 200
                            // }));
                            var o = JSON.parse(content);
                            var resultJSON = generate(o);
                            res.setHeader("Content-Type", 'application/json;charset=UTF-8');
                            res.write(JSON.stringify(resultJSON));
                            // res.write(JSON.stringify({
                            //     code: 200,
                            //     message: 'ok',
                            //     data: resultJSON
                            // }));
                            res.end();
                            // });
                            //利用dummy-json将djson生成为random的json测试数据
                        }
                        else if (realPath.indexOf('.djson') > -1 && !realPath.match('locale')) {
                            var content = fs.readFileSync(realPath, "utf-8");
                            var resultDummy = dummyjson.parse(content, { helpers: dummyHelpers });
                            res.write(resultDummy);
                            res.end();
                        }
                        else {
                            res.setHeader('Accept-Ranges', 'bytes');
                            var ext = path.extname(realPath);
                            ext = ext ? ext.slice(1) : 'unknown';
                            var contentType = mime[ext] || "text/plain";
                            res.setHeader("Content-Type", contentType);
                            var lastModified = stats.mtime.toUTCString();
                            var ifModifiedSince = "If-Modified-Since".toLowerCase();
                            res.setHeader("Last-Modified", lastModified);
                            //jsp动态文件简单支持
                            if (ext === "jsp") {
                                var content = fs.readFileSync(realPath, "utf-8");
                                content = content.replace(/<%@ page.*|.*%>/g, "");
                                content = content.replace(/<jsp:include page="(.*)"\/>/g, function (strpath) {
                                    return fs.readFileSync(path.join(path.dirname(realPath), strpath.replace(/^[^"]+"|"[^"]+$/g, "")), "utf-8");
                                });
                                res.write(content);
                                res.end();
                                return false;
                            }
                            if (ext.match(config.Expires.fileMatch)) {
                                var expires = new Date();
                                expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
                                res.setHeader("Expires", expires.toUTCString());
                                res.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
                            }

                            // 工具栏配置
                            if (toolsConf && toolsConf.showTools && ext === 'html') {
                                const $ = cheerio.load(fs.readFileSync(path.join(__dirname ,'/tools/tools.html'), "utf-8"));

                                toolstart()
                                    .then(data => { // 二维码
                                        const dir = port + req.url; //端口号和目录后缀
                                        return createQRcode(data, dir);
                                    })
                                    .then(data => { // 刷新按钮
                                        return reload(data);
                                    })
                                    .then(data => { // weinre自动注入
                                        return injectWeinre(data, toolsConf.weinre);
                                    })
                                    .then(data => { // vconsole
                                        return vconsole(data, toolsConf.weinre);
                                    })
                                    .then(data => {
                                        $('.bird-tools__menu').append(data);
                                        const body = cheerio.load(fs.readFileSync(realPath, "utf-8"));
                                        body('body').before($.html());
                                        res.write(body.html());
                                        res.end();
                                    });
                                return true;
                            }

                            if (req.headers[ifModifiedSince] && lastModified === req.headers[ifModifiedSince]) {
                                //console.log(req.url + " 304");
                                res.writeHead(304, "Not Modified");
                                res.end();
                            }
                            else {
                                var compressHandle = function (raw, statusCode, reasonPhrase) {
                                    var stream = raw;
                                    var acceptEncoding = req.headers['accept-encoding'] || "";
                                    var matched = ext.match(config.Compress.match);
                                    if (matched && acceptEncoding.match(/\bgzip\b/)) {
                                        res.setHeader("Content-Encoding", "gzip");
                                        stream = raw.pipe(zlib.createGzip());
                                    }
                                    else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                                        res.setHeader("Content-Encoding", "deflate");
                                        stream = raw.pipe(zlib.createDeflate());
                                    }
                                    //console.log(req.url + " " + statusCode);
                                    res.writeHead(statusCode, reasonPhrase);
                                    stream.pipe(res);
                                };
                                var raw = {};
                                if (req.headers["range"]) {
                                    var range = parseRange(req.headers["range"], stats.size);
                                    if (range) {
                                        res.setHeader("Content-Range", "bytes " + range.start + "-" + range.end + "/" + stats.size);
                                        res.setHeader("Content-Length", (range.end - range.start + 1));
                                        raw = fs.createReadStream(realPath, {
                                            "start": range.start,
                                            "end": range.end
                                        });
                                        compressHandle(raw, 206, "Partial Content");
                                    }
                                    else {
                                        //console.log(req.url + " 416");
                                        res.removeHeader("Content-Length");
                                        res.writeHead(416, "Request Range Not Satisfiable");
                                        res.end();
                                    }
                                }
                                else {
                                    raw = fs.createReadStream(realPath);
                                    compressHandle(raw, 200, "Ok");
                                }
                            }
                        }
                    }
                }
            });
        };
        pathHandle(realPath);
    }
}


module.exports = {

    middleware: function(params, rules, toolsConf) {
        var servers = params || {};
        toolsConf && toolsConf.weinre && startWeinre(toolsConf.weinre);
        return service(servers, rules, toolsConf);
    },

    start: function (params, rules, toolsConf) {
        var servers = params || {};
        var serverList = [];
        for (var i in servers) {
            var server = http.createServer(service(servers, rules, toolsConf));

            server.listen(i);

            console.log("A server runing at port: " + i + ".");

            serverList.push(server);
        }
        /*
         * 启动weinre服务
         */
        toolsConf && toolsConf.weinre && startWeinre(toolsConf.weinre);

    }
};
