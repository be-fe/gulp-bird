var fs = require("fs");

module.exports = function(req, res, realPath) {
    var folderList = [];
    var fileList = [];
    // 遍历目录下的文件
    var walk = function (path){
        var dirList = fs.readdirSync(path);

        dirList.forEach(function(item){
            if (!item.match(/^\./)) {  //过滤隐藏文件
                if(fs.statSync(path + '/' + item).isDirectory()){
                        // walk(path + '/' + item, path);
                        folderList.push({ id: path + '/' + item, path: path + '/' + item, fileName: item, pid: path });
                } else {
                    fileList.push({ id: path + '/' + item, path: path + '/' + item, fileName: item, pid: path });
                }
            }
        });
    }
    walk(realPath);
    folderList.forEach(function(item, index){
        // res.writeHead(200, {'content-type':'text/html'});

        res.write('<div>\
        <i style="display:inline-block; width:18px; height:18px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAwElEQVRYR+1XwQ0CIRDcuUrsQLIUoK1YgZZgCdqBJZwdeAVArgQbgTUkXmLiAzgxfJYvs7PDwCQsqPNC5/4EY8xmGIYjAJMRMzrnrq0Fg5lnANsSYhG5ee8PJdhSDKy1Ugp+40YRmStrvuAxxsQxrRHwa+/P+ntvAaQCUgz3LS+1livF8FIaw1ryHD6lSd+AOqAOqAPqgDqgDqgD/R1g5geAXe738o99EZmW0exERLnRrKkGAM8Qwrn/cNr0WCvIXn1pSuViiY9hAAAAAElFTkSuQmCC); background-size:cover; vertical-align:middle;"></i>\
        <a href="' + realPath.slice(realPath.lastIndexOf('/') + 1) + '/' + item.fileName + '" style="text-decoration:none; font-size:20px; color:#333; padding-left:7px; vertical-align:middle;">' + item.fileName +'</a>\
        </div>');
    });

    fileList.forEach(function(item, index){
        res.write('<div><i style="display:inline-block;width:20px;height:20px;"></i><a href="' + realPath.slice(realPath.lastIndexOf('/') + 1) + '/' + item.fileName + '" style="text-decoration: none;font-size: 20px; color: #333; padding-left: 10px;">' + item.fileName + '</a></div>');
    });
    res.end();
}
