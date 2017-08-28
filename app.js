var fileServer = require("./index");
var serverSettings = {
  "8787": {
    "basePath": "./demo"
  },
  "7676": {
    "basePath": "./demo"
  }
};
var transRules = {
    "7676": {
        //目标服务器的ip和端口，域名也可，但注意不要被host了
        targetServer: {
            "port": "443",
            "protocol": "https:",
            "host": "tieba.baidu.com",
            // "host": "https://tieba.baidu.com", //现在支持host填写协议名
            "replaceHeaders": true, //当为true时，如果cookie or header中有相同key，则替换
            "headers": {
                "cookie": "BAIDUID=7B1E61EE540290149BBC1CBF21DB0669:FG=1; BIDUPSID=7B1E61EE540290149BBC1CBF21DB0669; PSTM=1493288234; TIEBA_USERTYPE=4f2f8148a423cad91ea64acd; BDUSS=WdkVGpocX5QYmFZc2l5MGpBTERKaDNkWFhmQUJZeWM5ZGZrUnhXUXZGak9rNDVaSVFBQUFBJCQAAAAAAAAAAAEAAAD5uy2QwvvH4F8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM4GZ1nOBmdZU; STOKEN=7b37cffee26f2b9f2cc73dd0b20b3c3adffb95c2cf0f689b5e85883a095092a1; TIEBAUID=62025b4bb04f5f6dec1db9a2; bdshare_firstime=1499924499875; fixed_bar=1; wise_device=0; FP_LASTTIME=1500000482264",
                Host: "tieba.baidu.com",
                Referer: "http://tieba.baidu.com/"
            }
            // "host": "172.21.206.166",//gcrm
            // "port": "8080"
            // "host": "172.21.206.84",//gcrm
            // "port": "8081"
        },
        //特殊请求转发，可选配置，内部的host、port和attachHeaders为可选参数
        regExpPath: {
            "gcrm/" : {
                path : "gcrm/"
            }
            // ,
            // "vendor/": {
            //     "host": "127.0.0.1",
            //     "port": "7777",
            //     "path": "vendor/"
            // }
        }
    },
    "ajaxOnly": false
};

var toolsConf = {
    weinre: {
        open: false,
        port: 9000
    },
    showTools: true
};

fileServer.start(serverSettings, transRules, toolsConf);
