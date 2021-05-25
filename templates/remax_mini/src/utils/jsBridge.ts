const wxx = wx;

// 已支付宝sdk 为标准

export default {
  ...wxx,
  showToast: ({ content, type }: any) => {
    my.showToast({
      content: content,
      type: type,
    });
  },
} as typeof my;
