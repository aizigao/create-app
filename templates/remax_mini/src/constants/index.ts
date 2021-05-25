import jsBridge from "@/utils/jsBridge";

export const sysInfo = jsBridge.getSystemInfoSync() || {};

console.log({ sysInfo });

export const isIos = sysInfo.system === "iOS";

export const scaleRate = sysInfo.windowWidth / 375;

// https://sspai.com/post/62198
export const isIphoneX = (function () {
  const wH = sysInfo.screenHeight;
  const wW = sysInfo.screenHeight;
  return isIos && (wH === 812 || wW === 812 || wH === 896 || wW === 896 || wH === 693 || wW === 693);
})();

export const isAndroid = sysInfo.system === "Android";

// 缩放比
export const pixelRatio = sysInfo.pixelRatio;

// 通栏时距离顶部高度 单位rpx
export const TRANSPARENT_TITLE_PAGE_PH_HEIGHT =
  sysInfo.titleBarHeight + // titleBar
  sysInfo.statusBarHeight;

export const appSource =
  process.env.REMAX_APP_DT_NEV === "prod" ? "com.dtdream.publictransit" : "com.dtdream.publictransport";
