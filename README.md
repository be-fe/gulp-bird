# gulp-bird

### 起源

- 起源于[bird](https://github.com/weger/bird)，但是名字有点误导，并不是一个gulp插件，在bird基础上进行了一些优化并发布到了npm，配置方法和bird一样

### 功能介绍

#### 基本功能：本地联调解决跨域问题
本地webserver优先寻找对应的本地资源， 如果没找到则会走转发规则，转发规则也没找到才会返回404.

这样假设你有这样一个项目：
本地有如下文件

```
project
    --- index.html
    --- list.json
```

targetServer上有如下文件

```
targetServer
    --- detail.html
    --- detail.json
```

以peoject目录作为basePath，启动bird server，那么访问`localhost:8008/index.html`就会加载本地的index.html页面， 访问`localhost:8008/detail.html`就会加载服务端的页面，ajax请求`list.json`，返回的是本地的`list.json`, 请求`detail.json`，则返回服务器上的`detail.json`。

这样就通过代理服务器绕过了跨域限制。

#### 联调需要身份校验的接口：

在targetServer中配置身份校验信息，则可以帮助我们联调一些需要身份验证的接口

```js
    "headers": {
         "cookie": "xplatform_ge=4ffcc236a075c3e1f5068f172f654bbe9a1f23adc1563138c432b72b0d06261a153cc6f5a40"
    }
```

#### 特殊规则

可以通过配置规则，走一些特殊的转发规则，请参见下面的使用手册。

### 使用手册
1、创建一个config.js文件（名称任意）

```js
    var bird = require('gulp-bird');
    //静态服务器配置，可同时配置多个，域名需host到127.0.0.1
    var server = {
        "8008": {
            //静态文件根目录
            "basePath": "/Users/baidu/Desktop/frontEnd/Baidu/Hi-new-backend/src",
            // 是否开启调试模式，true(表示server端不缓存)，false（反之）
            "debug": true,
            //忽略的静态文件请求，与此正则匹配的请求将直接走转发规则（可选配置）
            "ignoreRegExp":  /\/js\/urls\.js/g

        }
    };
    //转发规则——静态服务器没有响应的或者忽略的请求将根据一下规则转发
    var transpondRules = {
        "8008": {
            //目标服务器的ip和端口，域名也可，但注意不要被host了
           targetServer: {
                "port": "8274",
                "host": "cp01-hiserver-sandbox1-tc.cp01.baidu.com",
                "changeOrigin": false, // Default: false - changes the origin of the host header to the target URL
                "replaceHeaders": true, //当为true时，如果cookie or header中有相同key，则替换
                "headers": {
                    "cookie": "xplatform_ge=4ffcc236a075c3e1f5068f172f654bbe9a1f23adc1563138c432b72b0d06261a153cc6f5a40"
                }
            },
            //特殊请求转发，可选配置，内部的host、port和attachHeaders为可选参数
            regExpPath: {
                "/hrlms/rs": {
                    //"host": "10.44.67.14",
                    //"port": "8045",
                    //"attachHeaders": {"app-id": 5},
                    "path": "/hrlms/rs"
                    changeOrigin: false //default false
                }
            }
        },
        "ajaxOnly": false
    };

    var toolsConf = {
        weinre: {
            open: true, //和移动调试工具条中的vconsole冲突, 当为true时vconsole自动关闭
            port: 9001
        },

        showTools: true //移动端调试工具条，PC端开发可关闭
    };

    bird.start(server, transpondRules, toolsConf);

```

2、用node执行它

```sh
    node config.js
```

### 如何开发和贡献代码

```sh
npm install
node app.js
```

然后访问`localhost:7676`查看效果