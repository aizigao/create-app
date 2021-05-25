import "array-from-polyfill";

// 兼容ios真机环境下Promise对象不存在finally方法
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function (callback: any) {
    this.then(
      (res) => {
        callback && callback(res);
      },
      (error) => {
        callback && callback(error);
      }
    );
    return this;
  };
}

const objectToValuesPolyfill = (object: any) => {
  return Object.keys(object).map((key) => object[key]);
};

Object.values = Object.values || objectToValuesPolyfill;
