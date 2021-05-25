import React, { useState } from "react";
import _ from "lodash";
import { View, Button, Image, Text } from "remax/one";
import ss from "./index.less";
import { Popup } from "annar";
import clsx from "clsx";
import Icon from "remax-iconfont-component";
import jsBridge from "@/utils/jsBridge";
import { useNativeEffect } from "remax";

type BtnC = {
  text?: string;
  action?(): void;
  loading?: boolean;
};
type Props = {
  type?: "default" | "biz"; //  biz 带个钻石
  onClose?(): void;
  open?: boolean;
  maskClose?: boolean;
  className?: string;
  title?: React.ReactNode;
  content?: React.ReactNode;
  bodyClassName?: string;
  maskOpacity?: number;
  closeBtn?: boolean;
  mask?: boolean;
  btns?: BtnC[];
  position?: "center" | "top" | "bottom" | "right" | "left";
  footer?: React.ReactNode;
};
export type useModalRes = {
  props: Props;
  hide: () => void;
  show: (nextProps: any) => void;
};
const overrideStyle = {
  background: "transparent",
  overflow: "visible",
};

const cancelConfig = {
  id: "cancel",
  text: "取消",
  className: ss.cancelBtn,
  action() {},
};

const comfirmConfig = {
  id: "comfirm",
  text: "确定",
  className: ss.comfirmBtn,
  action() {},
};

const getBtns = (btnConfigs: BtnC[] = []) => {
  const length = btnConfigs.length;
  if (length) {
    // 只有确定
    if (length === 1) {
      return [{ ...comfirmConfig, ...btnConfigs[0] }];
    } else if (length === 2) {
      // 有确定和取消
      return [
        { ...cancelConfig, ...btnConfigs[0] },
        { ...comfirmConfig, ...btnConfigs[1] },
      ];
    }
  }
  return [];
};
const DtModal: React.FC<Props> = ({ children, ...otherProps }) => {
  const {
    onClose = _.noop,
    open,
    mask,
    maskClose = false,
    position,
    bodyClassName,
    className,
    btns,
    type = "default",
    closeBtn = false,
    title,
    content,
    footer,
  } = otherProps;
  const isBizModal = type === "biz";
  const rBtns = getBtns(btns);

  useNativeEffect(() => {
    if (jsBridge.canIUse("setCanPullDown")) {
      jsBridge.setCanPullDown({
        canPullDown: !open,
      });
    }
  }, [open]);
  if (!open) {
    return <Text></Text>;
  }
  return (
    <Popup
      open={open}
      onClose={() => {
        maskClose && onClose();
      }}
      mask={mask}
      square
      style={overrideStyle}
      position={position}
    >
      <View className={ss.bg} disableScroll></View>
      <View className={ss.dtModalRoot}>
        <View className={clsx(ss.dtModal, isBizModal && ss.dtModalBiz, className)}>
          <View className={clsx(ss.body, bodyClassName)}>
            {children ? (
              children
            ) : (
              <>
                {title ? <View className={ss.title}>{title}</View> : null}
                {content ? <View className={ss.content}>{content}</View> : null}
              </>
            )}
          </View>
          {rBtns.length ? (
            <View className={clsx(ss.btnWrap, rBtns.length === 1 && ss.btnWrapSingle)}>
              {rBtns.map((btnC) => {
                return (
                  <Button loading={btnC.loading} key={btnC.id} className={btnC.className} onClick={btnC.action}>
                    {btnC.text}
                  </Button>
                );
              })}
            </View>
          ) : null}
          {footer}
        </View>
        {isBizModal && <Image src="/images/flower.png" className={ss.bizTopImg}></Image>}
        {closeBtn && (
          <View className={ss.close} onClick={onClose}>
            <Icon type="icon-close" className={ss.closeIcon}></Icon>
          </View>
        )}
      </View>
    </Popup>
  );
};

const defaultP: Partial<Props> = {
  type: "biz",
  open: false,
};

export const useModal = (): useModalRes => {
  const [props, setProps] = useState<Props>(defaultP);

  const show = (nextProps: Props) => {
    if (_.isEqual(props, nextProps)) {
      return;
    }

    // 为按钮添加关闭
    if (nextProps.btns) {
      nextProps.btns = (nextProps.btns as any[]).map((item) => {
        return {
          ...item,
          action() {
            item.action && item.action();
            setProps({
              ...nextProps,
              ...defaultP,
            });
          },
        };
      });
    }
    // 设置prop
    setProps({
      ...defaultP,
      ...nextProps,
      open: true,
    });
  };

  return {
    props: {
      ...props,
      onClose: () => {
        setProps({ ...props, ...defaultP });
      },
    },
    hide() {
      setProps({ ...props, ...defaultP });
    },
    show,
  };
};
export default DtModal;
