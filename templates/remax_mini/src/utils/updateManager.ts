import { logger } from "./";
import jsBridge from "./jsBridge";

function updateManager() {
  // 有版本限制
  if (jsBridge.canIUse("getUpdateManager")) {
    const updateManager = jsBridge.getUpdateManager();
    updateManager.onCheckForUpdate(function (res: any) {
      // 请求完新版本信息的回调
      logger.log("是否有新版本", res.hasUpdate);
    });
    updateManager.onUpdateReady(function () {
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate();
    });
    updateManager.onUpdateFailed(function () {
      logger.error("新版本下载失败");
    });
  }
}

export default updateManager;
