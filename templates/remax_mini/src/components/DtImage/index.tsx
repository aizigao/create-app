import React, { useState } from "react";
import clsx from "clsx";
import { Image } from "remax/one";
import { formatCdn } from "@dt-icloud/utils";
import styles from "./style.less";

const defaultImg = "/images/default_img.png";

type Props = {
  src: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  hasLoadBg?: boolean;
  mode?: "scaleToFill" | "aspectFit" | "aspectFill" | "widthFix";
};
const DtImage: React.FC<Props> = ({ src, width = 750, height, className, style, hasLoadBg = true, mode }) => {
  const [sSrc, setSSrc] = useState<string | null>(null);
  const rSrc = sSrc || (src ? formatCdn(src, width, height) : defaultImg);
  const [bgClass, setBgClass] = useState(styles.defaultBg);
  return (
    <Image
      className={clsx(hasLoadBg && bgClass, styles.img, className)}
      src={rSrc}
      style={style}
      mode={mode}
      onLoad={() => {
        setBgClass("");
      }}
      onError={() => {
        setSSrc(defaultImg);
      }}
    />
  );
};

export default DtImage;
