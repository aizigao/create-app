import createSelect from "@aizigao/uni-select";
import qs from "qs";
// 文档 http://fe-docs.appback-appbackdev.dtwb.ibuscloud.com/dt-components/utils/assem
export * from "@dt-icloud/utils";
import _ from "lodash";
import { isAndroid, isIos, isIphoneX } from "@/constants";
import jsBridge from "./jsBridge";

export const logger = {
  info(...args: any[]) {
    console.log(...args);
  },
  warn(...args: any[]) {
    console.log(...args);
  },
  log(...args: any[]) {
    console.log(...args);
  },
  error(...args: any[]) {
    console.error(...args);
  },
  debug(...args: any[]) {
    if (["local", "dev"].includes(process.env.REMAX_APP_DT_NEV as string)) {
      console.log(...args);
    }
  },
};

// 2x1 的图
export const dtDefaultImgBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABAQMAAADO7O3JAAAAA1BMVEXo6Og4/a9sAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==";

export const noopPromise = () => new Promise((res) => res(undefined));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const noopRender = (...args: any[]): React.ReactNode => null;

export const urlWithExtraQueryStr = (
  url: string,
  obj: Record<string, number | string | boolean>
  // hash = true
) => {
  // 加个 ?_前缀防止一下
  const joiner = /#\/(.*)\?/.test(url) ? "&" : "?";
  const extraStr = qs.stringify(obj);
  return url + joiner + extraStr;
};

export const apiPromify = <T>(api: (args: T) => void, toastOnErr = true) => {
  return (args: T) =>
    new Promise((res, rej) => {
      api({
        ...args,
        success: (info: any) => {
          res(info);
        },
        fail: (err: any) => {
          if (toastOnErr) {
            jsBridge.showToast({
              content: err.errorMessage,
            });
          }
          rej(err);
        },
      });
    });
};
export const concatStrIfValueNotNil = (val: string | number | null, tmp: string) => {
  if (!_.isNil(val) || val !== "") {
    return tmp.replace("$ph", String(val));
  }
  return "";
};

export const platform = createSelect({
  android: isAndroid,
  ios: isIos,
});

export const platformX = createSelect({
  android: isAndroid,
  iosX: isIos && !isIphoneX, // iphone X
  iosN: isIos && isIphoneX, // iphone normal
});
