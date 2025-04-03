import React, { FC } from "react";
// 引入Antd组件
import { Typography } from "antd";
const { Title } = Typography;

type PropsTyp = {
  // 不需要 fe_id ,只是展示Title组件，不需要提交数据
  text: string;
  level?: 1 | 2 | 3 | 4 | 5; // 层级 h1~h5
  isCenter?: boolean;
  color?: string; // 字体颜色
};

const QuestionTitle: FC<PropsTyp> = (props: PropsTyp) => {
  const { text, level, isCenter, color } = props;

  // // 样式
  // const style: CSSProperties = {}
  // // 是否居中
  // if(isCenter) style.textAlign = 'center'
  // // 字体颜色
  // if(color) style.color = color
  // if(level === 1) return <h1 style={style}>{text}</h1>
  // if(level === 2) return <h2 style={style}>{text}</h2>
  // if(level === 3) return <h3 style={style}>{text}</h3>
  // if(level === 4) return <h4 style={style}>{text}</h4>
  // if(level === 5) return <h5 style={style}>{text}</h5>
  // // 兜底
  // return null

  const genFontSize = (level: number) => {
    if (level === 1) return "32px";
    if (level === 2) return "28px";
    if (level === 3) return "24px";
    if (level === 4) return "20px";
    if (level === 5) return "16px";
    return "12px";
  };

  return (
    <Title
      level={level}
      style={{
        textAlign: isCenter ? "center" : "start",
        marginBottom: "0",
        fontSize: genFontSize(level as number),
        color: color,
      }}
    >
      {text}
    </Title>
  );
};
export default QuestionTitle;
