import React, { FC } from "react";
// import styles from "./QuestionTextarea.module.scss";
import { Typography, Input } from "antd";

const { Paragraph } = Typography;
const { TextArea } = Input;

type PropsTyp = {
  fe_id: string;
  props: {
    title: string;
    placeholder?: string;
    color?: string;
    maxLength: number;
  };
};

const QuestionTextarea: FC<PropsTyp> = ({ fe_id, props }) => {
  const { title, placeholder, color, maxLength } = props;

  // return <>
  //   <p style={{color}}>{title}</p>
  //   <div className={styles.textAreaWrapper}>
  //     <textarea name={fe_id} placeholder={placeholder} rows={5}></textarea>
  //   </div>
  // </>

  return (
    <div>
      <Paragraph strong style={{ color: color, marginBottom: "5px" }}>
        {title}
      </Paragraph>
      <div>
        <TextArea
          name={fe_id}
          placeholder={placeholder}
          showCount
          maxLength={maxLength}
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </div>
    </div>
  );
};

export default QuestionTextarea;
