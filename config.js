/**
 * 小程序配置文件
 */
'use strict';
// ENV
var env = 'development'; // 'development' or 'production'
// hj_house_xcx VERSION
var version = '1.0.3';
// development and production host
var template_id = "JOXLVwxCJy2S3vsPZCXtPXSypo-W9gHhounXsqFSN5Y";
var hosts = {
  development: 'https://psy.madridwine.cn',
  production: 'https://psy.madridwine.cn'
};

// static path
var static_path = 'http://house.shangxiaban.cn/wap3.0';

module.exports = {
  baidu_key: '415167759dc5861ddbbd14154f760c7e',
  env: env,
  version: version,
  static_path: static_path,
  template_id: template_id,
  host: hosts[env]
};