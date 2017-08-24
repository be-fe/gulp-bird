var http = require("http");
var path = require("path");
var utils = require("./utils.js");
var parseCookie = utils.parseCookie;
var objToCookie = utils.objToCookie;

module.exports = function () {
    this.transpond = function (req, res, transRules, next) {
        var port = req.headers.host.split(":")[1] || 80;
        var options = {};
        delete require.cache[path.join(__dirname, "../../config.js")];

        if (transRules.ajaxOnly && !req.headers.accept.match(/application\/json, text\/javascript/)) {
            res.writeHead("404");
            res.write("404");
            res.end();
            console.log("transpond \033[31m%s\033[m canceled, modify the config.js to transpond this.", req.headers.host + req.url);
            return false;
        }
        var transCurrent = transRules[port];
        if (!transCurrent) {
            console.error('The transponding rules of port"' + port + '" is not defined, please check the config.js!');
            return false;
        }

        if (transCurrent.targetServer) {
            options = {
                host: transCurrent.targetServer.host,
                port: transCurrent.targetServer.port || 80
            };
            options.headers = req.headers;
            options.path = req.url;
            options.method = req.method;

            /*
             * 修复自定义头部不生效的问题
             */
            var confHeaders = transCurrent.targetServer.headers;
            var replaceHeaders = transCurrent.targetServer.replaceHeaders;
            if (confHeaders && confHeaders instanceof Object) {
                for (var key in confHeaders) {
                    if (key === 'cookie') {
                        if (!options.headers.cookie) {
                            options.headers.cookie = confHeaders.cookie;
                        }
                        else {
                            var originCookieObj = parseCookie(options.headers.cookie);
                            var confCookieObj = parseCookie(confHeaders.cookie);
                            for (var k in confCookieObj) {
                                if (replaceHeaders) {
                                    originCookieObj[k] = confCookieObj[k];
                                }
                                else {
                                    if (!originCookieObj[k]) {
                                        originCookieObj[k] = confCookieObj[k];
                                    }
                                }
                            }
                            options.headers.cookie = objToCookie(originCookieObj);
                        }
                    }
                    else {
                        if (replaceHeaders) {
                            options.headers[key] = confHeaders[key];
                        }
                        else {
                            if (!options.headers[key]) {
                                options.headers[key] = confHeaders[key];
                            }
                        }
                    }
                }
            }
        }

        //匹配regExpPath做特殊转发
        var i;
        for (i in transCurrent.regExpPath) {
            if (req.url.match(i)) {
                options.headers = req.headers;
                // options.path = req.url;
                options.method = req.method;
                options.host = transCurrent.regExpPath[i].host || options.host;
                options.port = transCurrent.regExpPath[i].port || options.port;
                options.path = req.url.replace(i, transCurrent.regExpPath[i].path);

                if (transCurrent.regExpPath[i].attachHeaders) {
                    var j;
                    for (j in transCurrent.regExpPath[i].attachHeaders) {
                        options.headers[j] = transCurrent.regExpPath[i].attachHeaders[j];
                    }
                }
                break;
            }
        }


        if (JSON.stringify(options) == "{}") {
            next && next();
            return;
        }

        console.log("transpond \033[31m%s\033[m to \033[35m%s\033[m", req.headers.host + req.url, options.host + ":" + options.port + options.path);
        var serverReq = http.request(options, function (serverRes) {
            //console.log(req.url + " " + serverRes.statusCode);
            res.writeHead(serverRes.statusCode, serverRes.headers);
            serverRes.on('data', function (chunk) {
                res.write(chunk);
            });
            serverRes.on('end', function () {
                res.end();
            });
        });


        serverReq.on('error', function (e) {
            console.error('problem with request: ' + e.message);
        });

        req.addListener('data', function (chunk) {
            serverReq.write(chunk);
        });

        req.addListener('end', function () {
            serverReq.end();
        });
    };
};
