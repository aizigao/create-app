import uma from "umtrack-alipay";
import { logger } from "./";
import { sceneEnum } from "@/constants/enums";

const globalData = {
  dtEnv: process.env.REMAX_APP_DT_NEV,
};

const useUma = /prod/.test(process.env.REMAX_APP_DT_NEV as string);

const setGlobalDataByLaunchOptions = (launchOptions: any) => {
  const { scene, query = {} } = launchOptions;

  if (query.sourceFrom) {
    Object.assign(globalData, {
      sourceFrom: query.sourceFrom,
    });
  } else if (scene) {
    Object.assign(globalData, {
      sourceFrom: sceneEnum.getDescByValue(scene),
    });
  } else {
    Object.assign(globalData, {
      sourceFrom: "默认",
    });
  }
  logger.log("[埋点配置]", { launchOptions, globalData });
};
const setUmaGlobalData = (d: any) => {
  Object.assign(globalData, d);
};

useUma &&
  uma.init({
    appKey: "xx", //由友盟分配的APP_KEY
    // debug: /(local|dev)/.test(process.env.REMAX_APP_DT_NEV as string), //是否打开调试模式
    debug: false,
  });

const trackEvent = (eventName: string, data: Record<string, any> = {}) => {
  const trackData = {
    ...globalData,
    ...data,
  };
  logger.log(`[埋点]:eventName/${eventName},data:${JSON.stringify(trackData)}`);
  if (useUma) {
    uma.trackEvent(eventName, trackData);
  }
};

export { trackEvent, setGlobalDataByLaunchOptions, setUmaGlobalData };
