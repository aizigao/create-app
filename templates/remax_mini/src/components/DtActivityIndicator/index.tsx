import React from "react";
import classnames from "clsx";
import styles from "./index.less";
import { View } from "remax/one";

const baseSize = 80;
const ActivityIndicator: React.FC<{ size?: number; className?: string }> = ({ size = 72, className }) => {
  const scaleSize = size / baseSize;
  return (
    <View
      className={classnames(styles.cont, className)}
      style={{
        width: size,
        height: size,
      }}
    >
      <View
        className={styles["lds-ellipsis"]}
        style={{
          transform: `scale(${scaleSize})`,
        }}
      >
        <View className={styles["lds-ellipsis-i"]} />
        <View className={styles["lds-ellipsis-i"]} />
        <View className={styles["lds-ellipsis-i"]} />
        <View className={styles["lds-ellipsis-i"]} />
      </View>
    </View>
  );
};

export default ActivityIndicator;
