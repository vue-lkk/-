import React, { FC } from "react";
import { Typography } from "antd";
const { Paragraph } = Typography;

type PropsTyp = {
  // 不需要 fe_id ,只是展示Paragraph组件，不需要提交数据
  text?: string;
  isCenter?: boolean;
  color?: string;
  borderRadius?: number;
  background?: string;
  textIndext?: number;
  fontWeight?: boolean;
  fontSize?: number;
  lineHeight?: number;
  italic?: boolean;
};

const QuestionParagrapg: FC<PropsTyp> = (props: PropsTyp) => {
  const {
    text,
    isCenter,
    color,
    borderRadius,
    background,
    textIndext,
    fontWeight,
    fontSize,
    lineHeight,
    italic,
  } = props;

  //  样式
  // const style: CSSProperties = {
  //   color,
  //   borderRadius,
  //   background,
  // };
  // // 是否居中
  // if (isCenter) style.textAlign = "center";
  // // 处理换行
  // const textList = text?.split("\n") || [];
  // return (
  //   <p style={style}>
  //     {textList.map((t, index) => (
  //       <span key={index}>
  //         {index > 0 && <br />}
  //         {t}
  //       </span>
  //     ))}
  //   </p>
  // );

  // 处理换行
  const textList = text?.split("\n") || [];

  return (
    <Paragraph
      italic={italic}
      style={{
        textAlign: isCenter && textIndext === 0 ? "center" : "justify",
        marginBottom: "0px",

        color: `${color}`,
        borderRadius,
        background,
        textIndent: `${textIndext}em`,
        fontWeight: fontWeight ? "bold" : "400",
        fontSize: `${fontSize}px`,
        lineHeight,
      }}
    >
      {textList.map((t, index) => (
        <span key={index}>
          {index > 0 && <br />}
          {t}
        </span>
      ))}
    </Paragraph>
  );
};

export default QuestionParagrapg;
