const chalk = require("chalk");
const utils = require("./utils");

/**
 * data
 */

const { successInfo } = utils;

// 文档见
// https://github.com/jaywcjlove/mocker-api
// 配合 whitles 使用
// https://github.com/avwo/whistle
const proxy = {
  // Priority processing.
  // apiMocker(app, path, option)
  // This is the option parameter setting for apiMocker
  _proxy: {
    proxy: {
      // Turn a path string such as `/user/:name` into a regular expression.
      // https://www.npmjs.com/package/path-to-regexp
      // "/(.*)": "http://appdev.ibuscloud.com",
    },
    // pathRewrite: {
    //   '^/dt-msp-dev/api/': '',
    // },
    changeHost: true,
  },
  ...require("./data/metroRrainSchedule.js"),
  // ----- end ----
  "GET /api/mock-test": successInfo,
};

console.log(`${chalk.green("[MOCK重启完成/代理地址]")}: http://127.0.0.1:${process.env.PORT}`);

// 使用delay方法可以延迟返回数据
module.exports = proxy;
