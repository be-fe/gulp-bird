
// 普通日志 log
console.log('普通日志 log');
console.log('普通日志 log1');
console.log('普通日志 log222');
console.log('普通日志 log3333');
console.log('普通日志 log444444');

// 信息日志 info
console.info('信息日志 info');
// 调试日志 debug
console.debug('调试日志 debug');
// 警告日志 warn
console.warn('警告日志 warn');
// 报错日志 error
console.error('报错日志 error');

// 打印 object
var obj = {
  'foo': 'bar',
  'obj': { 'bool': true },
  'arr': [9, 8, 7],
  'tips': 'JS对象可以折叠展示'
};
console.log(obj);

// 触发 jserror
var err = undefined;
err.a = 1;

// 打印到系统面板 
console.log('[system]', '当前时间戳:', (+new Date()));
