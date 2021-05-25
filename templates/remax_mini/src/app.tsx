import "@/utils/selfPolyfill";
// import { setGlobalDataByLaunchOptions } from "@/utils/uma"; //app.js中 uma模块一定要放在最前头
import React from "react";
import { UseRequestProvider } from "ahooks";
import request from "@/utils/request";
import _ from "lodash";
import "./app.less";
import { useAppEvent } from "remax/macro";
import updateManager from "./utils/updateManager";
import UseUserInfo from "./containers/UseUserInfo";

const App: React.FC<any> = ({ children }) => {
  useAppEvent("onLaunch", (options) => {
    console.log({ onLaunchOptions: options });
  });
  useAppEvent("onShow", () => {
    updateManager();
  });

  return (
    <UseRequestProvider
      value={{
        requestMethod: request,
        formatResult: (res) => {
          if (!_.isNil(_.get(res, "success"))) {
            return res.data;
          }
          return res;
        },
      }}
    >
      <UseUserInfo.Provider>{children}</UseUserInfo.Provider>
    </UseRequestProvider>
  );
};

export default App;
