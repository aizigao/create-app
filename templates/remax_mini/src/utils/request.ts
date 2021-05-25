import { logger } from "./";
import _ from "lodash";
import { appSource } from "@/constants";
import jsBridge from "./jsBridge";

export const primaryRequestUtil = {
  isWaitingPrimaryRequest: true,
  waitingPrimaryRequest() {
    this.isWaitingPrimaryRequest = true;
  },
  afterPrimaryReqestFns: [] as any[],
  addAfterPrimaryReqestFns(cb: () => void) {
    if (this.isWaitingPrimaryRequest) {
      this.afterPrimaryReqestFns.push(cb);
    } else {
      cb();
    }
  },
  runAfterPrimaryRequestFns() {
    this.isWaitingPrimaryRequest = false;
    for (let index = 0; index < this.afterPrimaryReqestFns.length; index++) {
      this.afterPrimaryReqestFns[index]();
    }
    this.afterPrimaryReqestFns = [];
  },
};

interface IHttpRequestOptions {
  /**
   * 目标服务器url
   */
  url: string;

  /**
   * 设置请求的 HTTP 头，默认 {'content-type': 'application/json'}
   */
  headers?: Record<string, string>;

  /**
   * 默认GET，目前支持GET/POST
   */
  method?: "GET" | "POST";

  /**
   * 请求参数。
   *
   * 传给服务器的数据最终会是 String 类型，如果 data 不是 String 类型，会被转换成 String 。转换规则如下：
   * - 若方法为GET，会将数据转换成 query string： encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...
   * - 若方法为 POST 且 headers['content-type'] 为 application/json ，会对数据进行 JSON 序列化
   * - 若方法为 POST 且 headers['content-type'] 为 application/x-www-form-urlencoded ，会将数据转换成 query string： encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...
   */
  data?: Record<string, any>;

  /**
   * 超时时间，单位ms，默认30000
   */
  timeout?: number;

  /**
   * 期望返回的数据格式，默认json，支持json，text，base64
   */
  dataType?: "json" | "text" | "base64";

  /**
   * 调用成功的回调函数
   */
  //   success?(res: IHttpRequestSuccessResult): void;

  /**
   * 调用失败的回调函数
   */
  //   fail?(res: any): void;

  /**
   * 调用结束的回调函数（调用成功、失败都会执行）
   */
  //   complete?(res: any): void;
  toastOnFail?: boolean;
}

const defaultArgs: Partial<IHttpRequestOptions> = {
  method: "POST",
  timeout: 5000,
  dataType: "json",
  toastOnFail: true,
};

const isNil = (v: any) => v == null;

/**
 * 公共参数
 */
const getCommonArg = _.memoize(() => {
  return {
    appSource,
  };
});

const request = ({ toastOnFail = true, ...args }: IHttpRequestOptions, isPrimaryReqest = false) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (res, rej) => {
    if (!isPrimaryReqest && primaryRequestUtil.isWaitingPrimaryRequest) {
      await new Promise((iRes) => {
        const afterPrimise = () => {
          iRes("ok");
        };
        primaryRequestUtil.addAfterPrimaryReqestFns(afterPrimise);
      });
    }

    const { url, ...restArgs } = {
      ...defaultArgs,
      ...args,
    } as IHttpRequestOptions;
    // 只有路径时，使用默认地址
    let rUrl = url;
    if (!/^(https?:)?\/\//.test(url)) {
      rUrl = `${process.env.REMAX_APP_BASE_URL}${url}`;
      // rUrl = `${process.env.REMAX_APP_MOCK_URL}${url}`;
    }
    const commonArgs = getCommonArg();

    const requestArgs = {
      ...restArgs,
      data: {
        ...commonArgs,
        ...restArgs.data,
      },
      url: rUrl,
    };
    logger.debug("[http] request:" + rUrl, requestArgs);
    jsBridge.request({
      ...requestArgs,
      success(response: any) {
        logger.debug("[http] resp:" + rUrl, response);
        if (response.data && !isNil(response.data.result)) {
          if (response.data.result === 0) {
            res(response.data.item || response.data.items || undefined);
          } else {
            if (toastOnFail) {
              jsBridge.showToast({
                type: "none",
                content: response.data.errMsg || response.data.message,
              });
            }
            rej({
              ...response.data,
              message: response.data.message,
              isBizErr: true,
            });
          }
        }
      },
      fail(err: any) {
        logger.error(err);
        if (err.status === 1) {
          rej(err);
          return;
        }
        if (toastOnFail) {
          jsBridge.showToast({
            type: "none",
            content: err.errorMessage,
          });
        }
        rej(err);
      },
      complete() {},
    });
  });
};

request.post = (url: string, options: Omit<IHttpRequestOptions, "url" | "method"> = {}, isPrimaryReqest = false) => {
  return request({ url, method: "POST", ...options }, isPrimaryReqest);
};

request.get = (url: string, options: Omit<IHttpRequestOptions, "url" | "method"> = {}, isPrimaryReqest = false) => {
  return request({ url, method: "GET", ...options }, isPrimaryReqest);
};

export default request;
