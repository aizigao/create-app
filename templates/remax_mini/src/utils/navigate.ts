// import { isNumber, findLastIndex } from "lodash";
import _ from "lodash";
import qs from "qs";
import jsBridge from "./jsBridge";

type IParams = { [index: string]: string | number | boolean };

export const navigateTo = (url: string, params?: IParams, others = {}) => {
  jsBridge.navigateTo({
    url: url + (params ? `?${qs.stringify(params)}` : ""),
    ...others,
  });
};

export const redirectTo = (url: string, params?: IParams) =>
  jsBridge.redirectTo({ url: url + (params ? `?${qs.stringify(params)}` : "") });

export const navigateReLaunch = (url: string, params?: IParams) =>
  jsBridge.reLaunch({ url: url + (params ? `?${qs.stringify(params)}` : "") });

export const navigateBackOrRedirectTo = (url: string, params?: IParams) => {
  const historyPath = url.replace(/^\//, "");
  const currentPages = getCurrentPages();
  const lastIndex = _.findLastIndex(currentPages, (item) => {
    // https://opendocs.alipay.com/mini/framework/getcurrentpages#Q%EF%BC%9AgetCurrentPages%20%E6%96%B9%E6%B3%95%E6%80%8E%E4%B9%88%E8%8E%B7%E5%8F%96%E9%A1%B5%E9%9D%A2%E8%B7%AF%E5%BE%84%EF%BC%9F
    const route = item.__proto__.route;
    return route === historyPath;
  });

  if (lastIndex === -1) {
    redirectTo(url, params);
  } else {
    const delta = lastIndex > -1 ? currentPages.length - lastIndex - 1 : 1;
    jsBridge.navigateBack({ delta });
  }
};

// export const navigateBack = (deltaOrHistoryPathName: string | number = 1) => {
//   if (isNumber(deltaOrHistoryPathName)) {
//     wx.navigateBack({ delta: deltaOrHistoryPathName });
//   } else {
//     const historyPath = deltaOrHistoryPathName.replace(/^\//, "");
//     const currentPages = wx.getCurrentPages();
//     const lastIndex = findLastIndex(currentPages, (item) => {
//       return item.route === historyPath;
//     });

//     const delta = lastIndex > -1 ? currentPages.length - lastIndex - 1 : 1;

//     wx.navigateBack({ delta });
//   }
// };
