const { RemaxIconfontPlugin } = require("remax-iconfont-plugin");
const less = require("@remax/plugin-less");

module.exports = {
  plugins: [
    RemaxIconfontPlugin({
      cssURL: "https://at.alicdn.com/t/font_2045310_pukfjwtzw8.css",
    }),
    less({
      lessOptions: {
        globalVars: {
          "primary-color": '"#4569d4"',
        },
      },
    }),
  ],
};
