import _ from "lodash";
import xss, { getDefaultWhiteList } from "xss";

const whiteList: any = getDefaultWhiteList();

Object.keys(whiteList).forEach((key) => {
  const item = whiteList[key];
  whiteList[key] = [...item, "style", "class", "width"];
});

// specified you custom whiteList
const myxss = _.memoize((htmlStrWithoutTag) => {
  const htmlStr = String(htmlStrWithoutTag || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
  return xss(htmlStr, {
    whiteList,
    css: false,
  });
});

export default myxss;
