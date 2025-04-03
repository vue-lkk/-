import React, { FC } from "react";
// import styles from "./QuestionInput.module.scss";
// 引入Antd组件
import { Input, Flex } from "antd";
// const { Paragraph } = Typography;

type PropsTyp = {
  fe_id: string; // 组件id
  // 组件props属性
  props: {
    title: string;
    placeholder?: string;
    color?: string;
    layout: "horizontal" | "vertical"; // 布局方式
  };
};

/**
 * 输入框
 * @param fe_id 输入框组件的id
 * @param props 输入框组件的props
 * @returns
 */
const QuestionInput: FC<PropsTyp> = ({ fe_id, props }) => {
  const { title, placeholder, color, layout } = props;

  // 利用普通方式实现
  // return <>
  //   <p style={{color:color}}>{title}</p>
  //   <div className={styles.inputWrapper}>
  //     {/* 将组件的fe_id 作为表单项的key值 */}
  //     <input name={fe_id} placeholder={placeholder} />
  //   </div>
  // </>

  // 利用antd组件方式实现
  return (
    <Flex
      vertical={layout === "vertical"}
      justify={layout === "vertical" ? "" : "start"}
      align={layout !== "vertical" ? "center" : ""}
      gap={5}
    >
      {/* 标题 */}
      <div
        style={{
          color: color,
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        {title}
      </div>

      {/* 输入框 */}
      <div style={{ display: "flex", flex: "1" }}>
        {/* 将输入框组件的fe_id 作为表单项的key值,value为用户输入值 */}
        <Input name={fe_id} placeholder={placeholder} />
      </div>
    </Flex>
  );
};

export default QuestionInput;
