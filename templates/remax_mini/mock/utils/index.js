const Mock = require('mockjs');
const path = require('path');
const _ = require('lodash');
const fp = require('lodash/fp');

// delay:: Number -> Promise
const delay = ms => new Promise(res => setTimeout(res, ms));

// randomRangeTime:: (Number,Number) -> Number
const randomRangeTime = (f_ms, t_ms) => Math.random() * (t_ms - f_ms) + f_ms;

// delayIt:: (Number, Number) -> Promise
const delayIt = fp.compose(delay, randomRangeTime);

// const GenList = (() => {
//   let lastOffset = 0;
//   return () => {
//     const limit = 20;
//     const preOffset = lastOffset;
//     lastOffset = preOffset + limit;
//     return _.range(preOffset, lastOffset).map(item => {
//       return {
//         id: item,
//         title: `xxxx${item}`,
//       };
//     });
//   };
// })();

const getMockData = (filePath, subKey = '') => {
  // eslint-disable-next-line
  let pathData = require(path.resolve(__dirname, '../', filePath));
  if (subKey) {
    pathData = _.get(pathData, subKey);
  }
  let mockData = {
    __mockError: true,
    message: 'mock数据格式有误',
  };

  return async (req, res) => {
    if (_.isObject(mockData)) {
      mockData = Mock.mock(pathData);
    }

    // 数据延时mock 50 - 600ms
    await delayIt(50, 600);

    res.status('200').json({
      message: 'JUST MOCK IT',
      result: 0,
      success: true,
      ...mockData,
      _DT_MOCK: true,
    });
  };
};

const getMockDataByTpl = tpl => {
  return async (req, res) => {
    // 数据延时mock 50 - 600ms
    await delayIt(50, 600);

    res.status('200').json({
      message: 'JUST MOCK IT',
      result: 0,
      success: true,
      ...Mock.mock(tpl),
      _DT_MOCK: true,
    });
  };
};

const successInfo = {
  result: 0,
  message: 'JUST MOCK IT',
  success: true,
  _DT_MOCK: true,
};

const failInfo = {
  result: -1,
  success: false,
  message: 'JUST MOCK IT',
  _DT_MOCK: true,
};

module.exports = {
  getMockData,
  successInfo,
  failInfo,
  getMockDataByTpl,
};
