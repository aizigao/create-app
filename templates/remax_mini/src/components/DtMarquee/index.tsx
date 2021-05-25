import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Text } from "remax/one";
import { ScrollView } from "remax/wechat";
import ss from "./style.less";
import _ from "lodash";

type Props = React.ComponentPropsWithoutRef<typeof ScrollView> & {
  runIfGtLetterSize: number; // 超过多少字后开滚
  velocityRate?: number;
  children: React.ReactNode;
};

const DURATION_BASE_MS = 6;
const DtMarquee: React.FC<Props> = ({ runIfGtLetterSize = 20, children, className, velocityRate = 1, ...others }) => {
  const [marquing, setMarquing] = useState(false);
  const [marquingRate, setMarquingRate] = useState<string>("0s");
  useEffect(() => {
    let checkStr = children;
    if (_.isArray(children) && _.isString(children[0])) {
      checkStr = children.join("");
    }

    if (!_.isString(checkStr)) {
      return;
    }
    // effect
    if (!(children && checkStr.length)) {
      return;
    }
    const needed = children && checkStr.length > runIfGtLetterSize;
    if (!needed) {
      setMarquing(false);
      setMarquingRate("0s");
      return;
    }

    const cLenRate = checkStr.length / runIfGtLetterSize;
    setMarquing(true);
    setMarquingRate(cLenRate * DURATION_BASE_MS * velocityRate + "s");
  }, [children, velocityRate, runIfGtLetterSize]);

  return (
    <ScrollView className={clsx(ss.cont, className)} {...others}>
      {marquing ? (
        <Text
          className={ss.runing}
          style={{
            animationDuration: marquingRate,
          }}
        >
          {children}&nbsp;
          {children}
        </Text>
      ) : (
        <Text className={ss.static}>{children}</Text>
      )}
    </ScrollView>
  );
};

export default DtMarquee;
