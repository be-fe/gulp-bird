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
        if (item.match(/^[^=]*(?==)/)) {
            obj[item.match(/^[^=]*(?==)/)[0]] = item.match(/=(\S*)/)[1]
        }
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

exports.generate = function (jsonPattern) {
    try {
        var matches = jsonPattern[0].match(/{{repeat\((\d),(\d)\)}}/);
        var repeatCount = randomBetween(matches[1], matches[2]);
        var obj = {
            code: 200,
            message: 'ok',
            data: []
        };
        for (var i = 0; i < repeatCount; i++) {
            var item = {};
            var dataPattern = jsonPattern[1];
            var keys = Object.keys(dataPattern);
            for (var j = 0; j < keys.length; j++) {
                item[keys[j]] = generatePattern(dataPattern[keys[j]]);
            };
            // var item = jsonPattern[1];
            obj.data.push(item);
        };
        return obj;
    } catch (e) {
        return jsonPattern;
        // return undefined;
    }
}

exports.randomBetween = function (a, b) {
    var random = Math.random() * (b - a + 1);
    return Math.floor(~~a + random);
}

exports.generatePattern = function (pattern) {
    // var functionString = pattern.match(/{{([\w|(|)]*)}}/)[1];
    if (pattern.match('function')) {
        return eval(pattern);
    } else {
        try {
            var functionString = pattern.replace(/\{\{/, '').replace(/}}/, '');
            return eval('g.' + functionString);
        }
        catch (e) {
            return pattern;
        }
    }
}
exports.g = {
    index: function () {
        return Math.floor(Math.random() * 10);
    },
    guid: function () {
        return Math.floor(Math.random() * 10);
    },
    bool: function () {
        return Math.random() > 0.5;
    },
    integer: function (a, b) {
        var random = Math.random() * (b - a + 1);
        return Math.floor(~~a + random);
    }
};

exports.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//解决ie new date()带参数bug问题
exports.NewDate = function(timeString) {
    var dates = timeString.split(' '),
        ymd = dates[0].split('-'),
        date = new Date();
    date.setUTCFullYear(ymd[0], ymd[1] - 1, ymd[2]);
    if (dates[1]) {
        time = dates[1] && dates[1].split(':');
        date.setUTCHours(Number(time[0]), Number(time[1]), Number(time[2]), 0);
    }
    else {
        date.setUTCHours(0, 0, 0, 0);
    }
    return date;
}

exports.dummyHelpers = {
    dateUTC: function (min, max, options) {
        var time = dummyHelpers.timeUTC(min, max, options);
        return time - time % (24 * 60 * 60 * 1000);
    },
    timeUTC: function (min, max, options) {
        var minTime = NewDate(min).getTime(),
            maxTime = NewDate(max).getTime();
        return randomInt(minTime, maxTime);
    },
    animals: function (options) {
        var animals = ['cat', 'dog', 'cow', 'wolf', 'giraffe'],
            rIndex = randomInt(0, animals.length);
        return animals[rIndex];
    },
    genders: function (options) {
        var genders = ['male', 'female'],
            rIndex = randomInt(0, genders.length);
        return genders[rIndex];
    }
};

exports.handleUrl = function (url) {
    var protocol = 'http:';
    var host = url.replace(/\w+:\/\//, function(rs,$1,$2,offset,source) {
        protocol = rs.replace('//', '');
        return '';
    });

    return {
        protocol: protocol,
        host: host,
    }
};


