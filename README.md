# gulp-bird

### 起源

- 起源于[bird](https://github.com/weger/bird)，但是名字有点误导，并不是一个gulp插件，在bird基础上进行了一些优化并发布到了npm，配置方法和bird一样

### 使用手册
1、创建一个config.js文件（名称任意）

```js
    var bird = require('gulp-bird');
    //静态服务器配置，可同时配置多个，域名需host到127.0.0.1
    var server = {
        "8008": {
            //静态文件根目录
            "basePath": "/Users/xieyu/Desktop/frontEnd/Baidu/Hi-new-backend/src"
        }
    };
    //转发规则——静态服务器没有响应的或者忽略的请求将根据一下规则转发
    var transpondRules = {
        "8008": {
            //目标服务器的ip和端口，域名也可，但注意不要被host了
           targetServer: {
                "port": "8274",
                "host": "cp01-hiserver-sandbox1-tc.cp01.baidu.com",
                "replaceHeaders": true, //当为true时，如果cookie or header中有相同key，则替换
                "headers": {
                    "cookie": "xplatform_ge=4ffcc236a075c3e1f5068f172f654bbe9a1f23adc1563138c432b72b0d06261a153cc6f5a40"
                }
            }
        },
        "ajaxOnly": false
    };

    bird.start(server, transpondRules);

```

2、用node执行它

```sh
    node config.js
```