import React from "react";
import clsx from "clsx";
import ss from "./styles.less";
import DtActivityIndicator from "../DtActivityIndicator";
import { View, Text, Image } from "remax/one";
import _ from "lodash";

const NO_DATA_PNG = "/images/noData.png";
const NO_DATA_INLINE_PNG = "/images/noData_inline.png";

type EmptySize = "page" | "line";
type Options = {
  emptySize: EmptySize;
  emptyText: string;
  failText: string;
  freshBtnText: string;
};
const defaultOptions: Partial<Options> = {
  emptySize: "line",
  emptyText: "哎呀，暂时没有数据！",
  failText: "哎呀，系统开小差啦！",
  freshBtnText: "点击刷新",
};

const DtAsyncCont: React.FC<{
  loading?: boolean;
  loadFailed?: boolean;
  renderChildrenOnLoading?: boolean;
  fullPage?: boolean;
  isEmpty?: boolean;
  options?: Partial<Options>;
  bgc?: string;
  onFresh?(): void;
}> = ({
  children,
  fullPage = false,
  renderChildrenOnLoading = false,
  loading,
  loadFailed,
  isEmpty,
  options: originOptions,
  bgc = "transparent",
  onFresh = _.noop,
}) => {
  const options = {
    //--
    ...defaultOptions,
    emptySize: fullPage ? "page" : "line",
    ...originOptions,
  };

  if (loadFailed) {
    return (
      <View className={fullPage ? ss.wrapFullPage : ss.wrapInline} style={{ backgroundColor: bgc }}>
        <View className={ss.emtpyCont}>
          <Image src={fullPage ? NO_DATA_PNG : NO_DATA_INLINE_PNG} className={ss.emptyImage} />
          <Text className={ss.emptyText}>{options.failText}</Text>
          <View onTap={onFresh} className={ss.freshBtn}>
            {options.freshBtnText}
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View className={clsx(!fullPage && ss.loadingWrapperInline)}>
        {renderChildrenOnLoading ? children : null}
        <View className={fullPage ? ss.wrapFullPage : ss.wrapInline} style={{ backgroundColor: bgc }}>
          <View className={ss.loadingCont}>
            <DtActivityIndicator />
          </View>
        </View>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View className={fullPage ? ss.wrapFullPage : ss.wrapInline} style={{ backgroundColor: bgc }}>
        <View className={ss.emtpyCont}>
          <Image src={fullPage ? NO_DATA_PNG : NO_DATA_INLINE_PNG} className={ss.emptyImage} />
          <Text className={ss.emptyText}>{options.emptyText}</Text>
        </View>
      </View>
    );
  }
  return children as React.ReactElement;
};

export default DtAsyncCont;
