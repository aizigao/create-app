import { View, datePicker } from "remax/one";
import Icon from "remax-iconfont-component";
import { useControllableValue } from "ahooks";
import dayjs from "dayjs";
import ss from "./index.less";
import React, { useMemo } from "react";
import _ from "lodash";
import UseCouponTemplateInfo from "@/containers/UseCouponTemplateInfo";

type Props = {
  value: string; // YYYY-MM 其它暂不考虑
  onChange(nVal: string): void;
  startDate?: string; //String 否 最小日期时间。
  endDate?: string; //String 否 最大日期时间。
};
const formatorStr = "YYYY-MM";
const DtDatePicker: React.FC<Props> = (props) => {
  const pickerProps = _.pick(props, ["startDate", "endDate"]);
  const [templateInfo] = UseCouponTemplateInfo.useContainer();
  const [state, setState] = useControllableValue(props, {
    defaultValue: dayjs(templateInfo.timestamp).format(formatorStr),
  });

  const isCurrentMonth = useMemo(() => {
    const currentMonth = dayjs(templateInfo.timestamp).format(formatorStr);
    return state === currentMonth;
  }, [state, templateInfo.timestamp]);

  return (
    <View
      className={ss.datePicker}
      onClick={() =>
        datePicker({
          ...pickerProps,
          format: formatorStr.replace("YYYY", "yyyy"),
          currentDate: state,
          success: ({ date }) => setState(date),
        })
      }
    >
      {isCurrentMonth ? "本月" : state}
      <Icon type="icon-down-solid" className={ss.datePickerIcon}></Icon>
    </View>
  );
};

export default DtDatePicker;
