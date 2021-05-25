const utils = require("../utils");
const { successInfo } = require("../utils");
const { getMockDataByTpl } = utils;

// /v1/bus/getQrcodeStopByQrcodeNo get
// | city        | 城市               | String |      |
// | appSource  | app源              | String |      |
// | `QrcodeNo` | 二维码编号唯一标识 | String |      |

// http://192.168.110.9:8090/pages/viewpage.action?pageId=31231346
const metroStopRouteList = {
  result: 0,
  message: "success",
  total: 1,
  pageCount: 1,
  items: [
    {
      stopName: "@cword(100)",
      stops: [
        {
          stop: {
            metroStop: "@cword(50)",
            metroLines: "[1号线]",
          },
          routeCount: 4,
          "routes|4": [
            {
              route: {
                routeId: "@id",
                routeName: "8888H路",
                type: 1,
                "direction|1": [4 | 5], // 4上行 5下行
                origin: "@cword(3,12)",
                terminal: "@cword(3,12)",
                routeNo: "@id",
              },
              station: {},
              nextStation: "丰乐桥南",
              "noBusDesc|1": ["预计发车", "圧夺在夺圧", "圧夺在夺圧343434"],
              "buses|0-1": [
                {
                  "targetStopCount|1": [0 | 2],
                  targetSeconds: "@datetime",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const getBusPlanTimeByRouteNo = {
  "item|210": [
    {
      busSelfNo: "@id", //     | String  | 车辆自编号                               |
      routeName: "@word(4,10)", //     | String  | 线路名称                                 |
      "direction|1": [1, 2, 3], //     | Integer | 上下行标识1表示上行，2表示下行。环线为3. |
      execDate: "@date", //      | String  | 营运日期yyyy-MM-dd                       |
      planStartTime: "@datetime", // | String  | 计划发车时间yyyy-MM-dd HH:mm:ss          |
      shiftNo: "@id", //       | Integer | 班次代号                                 |
      empId: "@id", //         | Integer | 司机编号                                 |
      empName: "@cword", //       | String  | 司机名称                                 |
      routeId: "@id", //       | Integer | 线路编号                                 |
      startStopId: "@id", //   | Integer | 始发站id                                 |
      endStopId: "@id", //     | Integer | 终点站id                                 |
      startStopName: "@cword(4)", // | String  | 始发站名称                               |
      endStopName: "@cword(4)", //   | String  | 终点站名称                               |
    },
  ],
};

// https://appdev.ibuscloud.com/v1/bus/getQrcodeStopByQrcodeNo?city=330100&qrcodeNo=skb33010020210108142021&appSource=com.dtdream.publictransport
module.exports = {
  "GET /v1/bus/getQrcodeStopByQrcodeNo": getMockDataByTpl(metroStopRouteList),
  "GET /v1/bus/getBusPlanTimeByRouteNo": getMockDataByTpl(getBusPlanTimeByRouteNo),
};
