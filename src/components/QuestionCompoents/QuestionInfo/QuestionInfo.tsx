import React, { FC } from "react";
import { Typography } from "antd";
const { Title, Paragraph } = Typography;

type PropsTyp = {
  title: string;
  desc?: string;
  descColor?: string;
  titleColor?: string;
};

const QuestionInfo: FC<PropsTyp> = (props: PropsTyp) => {
  const { title, desc, descColor, titleColor } = props;

  // // 处理换行
  // const descTextList = desc?.split('\n') || []
  // return <div style={{textAlign:'center'}}>
  //   <h1 style={{color:titleColor}}>{title}</h1>
  //   <p style={{color:descColor}}>
  //     {descTextList.map((t, index) => (
  //       <span key={index}>
  //         {index > 0 && <br />}
  //         {t}
  //       </span>
  //     ))}
  //   </p>
  // </div>

  // 处理换行
  const descTextList = desc?.split("\n") || [];

  return (
    <div style={{ textAlign: "center" }}>
      <Title style={{ fontSize: "24px", color: titleColor }}>{title}</Title>
      <Paragraph style={{ color: descColor, marginBottom: 0 }}>
        {descTextList.map((t, index) => (
          <span key={index}>
            {index > 0 && <br />}
            {t}
          </span>
        ))}
      </Paragraph>
    </div>
  );
};

export default QuestionInfo;
