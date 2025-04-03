import React, { FC, useEffect, useState } from "react";
// import styles from "./QuestionRadio.module.scss";
import { Typography, Radio, Space, ConfigProvider } from "antd";
import type { RadioChangeEvent } from "antd";
const { Paragraph } = Typography;

type PropsTyp = {
  fe_id: string; // 单选组件id
  props: {
    title: string; // 标题
    isVertical: boolean; // 是否垂直
    options: Array<{
      // 选项
      value: string;
      text: string;
    }>;
    value: string; // 选中项
    isWrap: boolean;
    optionType: "default" | "button"; //切换单选按钮风格
    color: string;

    buttonBg: string; //单选框按钮背景色
    buttonColor: string; // 单选框按钮文本颜色
    buttonSolidCheckedBg: string; //单选框实色按钮选中时的背景色
    buttonSolidCheckedColor: string; //单选框实色按钮选中时的文本颜色
  };
};

// 单选框
const QuestionRadio: FC<PropsTyp> = ({ fe_id, props }) => {
  const {
    title,
    isVertical,
    value,
    options,
    isWrap,
    optionType = "button",
    color,
    buttonBg,
    buttonColor,
    buttonSolidCheckedBg,
    buttonSolidCheckedColor,
  } = props;

  useEffect(() => {
    // console.log(optionType);
  }, []);

  // 选中：利用普通方式实现
  // const [gender, setGender] = useState(value);
  // function handleRadioChange(event: ChangeEvent<HTMLInputElement>) {
  //   setGender(event.target.value);
  // }

  // 选中：利用antd组件方式实现
  const [radioValue, setRadioValue] = useState(value);
  const onChange = (e: RadioChangeEvent) => {
    // console.log("radio checked", e.target.value);
    setRadioValue(e.target.value);
  };

  return (
    // 利用普通方式实现
    // <>
    //   <p>{title}</p>
    //   <ul className={styles.list}>
    //     {options.map((opt) => {
    //       const { value: val, text } = opt;
    //       // 判断垂直、水平
    //       let clasName = "";
    //       if (isVertical) clasName = styles.vertivalItem;
    //       else clasName = styles.horizontalItem;

    //       return (
    //         <li key={val} className={clasName}>
    //           <label>
    //             <input
    //               type="radio" // 单选
    //               name={fe_id} // 分组名称
    //               value={val} // 值
    //               checked={val === gender} // 判断选中
    //               // defaultChecked={val === value}
    //               onChange={handleRadioChange}
    //             />
    //             {text}
    //           </label>
    //         </li>
    //       );
    //     })}
    //   </ul>
    // </>

    // 利用antd组件方式实现
    <div>
      <Paragraph strong style={{ color, marginBottom: "3px" }}>
        {title}
      </Paragraph>

      <ConfigProvider
        theme={{
          components: {
            Radio: {
              /* 这里是你的组件 token */
              buttonBg, //单选框按钮背景色
              buttonColor, // 单选框按钮文本颜色

              buttonSolidCheckedBg,
              buttonSolidCheckedHoverBg: buttonSolidCheckedBg,
              buttonSolidCheckedActiveBg: buttonSolidCheckedBg, //单选框实色按钮选中时的背景色
              buttonSolidCheckedColor, //单选框实色按钮选中时的文本颜色
            },
          },
        }}
      >
        <Radio.Group
          value={radioValue}
          optionType={optionType}
          buttonStyle="solid"
          onChange={onChange}
          name={fe_id}
        >
          <Space
            direction={isVertical ? "vertical" : "horizontal"}
            style={{
              display: "flex",
              flexWrap: isWrap ? "wrap" : "nowrap",
              justifyContent: "start",
            }}
          >
            {options.map((opt) => {
              const { value, text } = opt;
              return (
                <Radio key={value} value={value} style={{ fontSize: "13px" }}>
                  {text}
                </Radio>
              );
            })}
          </Space>
        </Radio.Group>
      </ConfigProvider>
    </div>
  );
};

export default QuestionRadio;
