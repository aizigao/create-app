import { delay, logger } from "@/utils";
import { primaryRequestUtil } from "@/utils/request";
import { useInterval } from "ahooks";
import _ from "lodash";
import { useState } from "react";
import { useAppEvent } from "remax/macro";
import { createContainer } from "unstated-next";

const EMPTY_OBJ = {};

const REFRESH_USER_SESSION_INTERVAL_MS = 20 * 60 * 1000; // 后台session为30分钟

// TIP: edit flowing type
type UserInfo = Record<string, any>;

export const userStore = {
  data: EMPTY_OBJ as UserInfo,
  set(d) {
    this.data = d;
  },
  get() {
    return this.data;
  },
} as {
  data: UserInfo;
  set(d: UserInfo): void;
  get(): UserInfo;
};

type UserInfoState = "fail" | "success" | "initial";
type Result = {
  userInfo: UserInfo;
  userInfoState: UserInfoState;
  loginSilent: () => Promise<any>;
  loginUser: () => Promise<any>;
  setUserInfo: (nextUserInfo: UserInfo, force?: boolean) => void;
};

const setIfChange = (fn: (...x: any[]) => void, pre: any, next: any, force = false) => {
  if (force || !_.isEqual(pre, next)) {
    fn(next);
  }
};
export default createContainer(function useUserInfo(): Result {
  const [userInfo, setUserInfoO] = useState(EMPTY_OBJ);
  const [userInfoState, setUserInfoState] = useState<UserInfoState>("initial");

  //-- 设置用户数据
  const setUserInfo = (nextUserInfo: UserInfo, force = false) => {
    setIfChange(setUserInfoO, userInfo, nextUserInfo, force);
    //-- 用户信息更新到全局的store中
    userStore.set(nextUserInfo);
  };

  /**
   * 静默登录
   */
  const loginSilent = async () => {
    /* ------ 获取用户数据 ---------- */
    console.log("TODO:处理一下用户");
    await delay(1000);
    setUserInfo({ mock: true });
    setUserInfoState("success");
    // 这句放在最后, 执行后接口
    primaryRequestUtil.runAfterPrimaryRequestFns();
  };

  /**
   * 用户登录
   */
  const loginUser = async () => {};

  const [refreshUserInterval, setRefreshUserInterval] = useState<number | null>(null);
  useAppEvent("onShow", async () => {
    await loginSilent();
    setRefreshUserInterval(REFRESH_USER_SESSION_INTERVAL_MS);
  });

  useAppEvent("onHide", () => {
    primaryRequestUtil.waitingPrimaryRequest();
  });

  // 刷新用户session
  useInterval(() => {
    if (!_.isEmpty(userInfo)) {
      loginSilent();
    }
  }, refreshUserInterval);

  logger.debug("[globalData/userInfo]:", userInfo);
  return {
    userInfo,
    userInfoState,
    loginSilent,
    loginUser,
    setUserInfo,
  };
});
