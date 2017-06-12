exports.parseRange = function (str, size) {
    if (str.indexOf(",") !== -1) {
        return;
    }
    var range = str.split("-"),
        start = parseInt(range[0], 10),
        end = parseInt(range[1], 10);
    // Case: -100
    if (isNaN(start)) {
        start = size - end;
        end = size - 1;
        // Case: 100-
    } else if (isNaN(end)) {
        end = size - 1;
    }
    // Invalid
    if (isNaN(start) || isNaN(end) || start > end || end > size) {
        return;
    }
    return {start: start, end: end};
};

exports.parseCookie = function (cookieStr) {
    var tmpArr = cookieStr.split('; ');
    var obj = {};
    tmpArr.forEach(function(item, index) {
        obj[item.match(/^[^=]*(?==)/)[0]] = item.match(/=(\S*)/)[1]
    });
    return obj;
};

exports.objToCookie = function (obj) {
    var str = '';
    for (var i in obj) {
        str += (i + '=' + obj[i] + '; ');
    }
    str = str.replace(/;\s$/g, '');
    return str;
};

