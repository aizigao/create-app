import React from "react";
import UseUserInfo from "@/containers/UseUserInfo";
import { navigateTo } from "@/utils/navigate";
import DtAsyncCont from "../DtAsyncCont";

const dtUserLayout = (MyComponent: React.FC, noFailPage = false) => {
  const DtUserPage = () => {
    const { userInfoState } = UseUserInfo.useContainer();

    const loading = userInfoState === "initial";
    const loadedFail = userInfoState === "fail";

    if (loading) {
      return <DtAsyncCont loading fullPage></DtAsyncCont>;
    }

    if (loadedFail && !noFailPage) {
      return (
        <DtAsyncCont
          fullPage
          loadFailed
          onFresh={() => {
            navigateTo("/pages/index/index");
          }}
          options={{
            freshBtnText: "返回首页",
            failText: "获取用户信息失败",
          }}
        />
      );
    }

    return <MyComponent></MyComponent>;
  };
  return DtUserPage;
};

export default dtUserLayout;
