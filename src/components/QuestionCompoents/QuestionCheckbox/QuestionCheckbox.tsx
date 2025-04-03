import React, { FC, useEffect, useState } from "react";
import styles from "./QuestionCheckbox.module.scss";

type PropsTyp = {
  fe_id: string; // 组件id
  props: {
    title: string; //标题
    isVertical?: boolean; // 垂直
    list: Array<{
      value: string;
      text: string;
      checked: boolean;
    }>;
    value: string; // 默认选择
    isWrap?: boolean; //是否换行
    color?: string;
  };
};

// 单选框
const QuestionCheckbox: FC<PropsTyp> = ({ fe_id, props }) => {
  const { title, isVertical, list, isWrap, color } = props;
  // 收集多选项
  const [selectedValue, setSelectedValue] = useState<string[]>([]);

  // 初始化时，判断默认选中
  useEffect(() => {
    list.forEach((item) => {
      const { value, checked } = item;
      if (checked) {
        setSelectedValue((selectedValue) => {
          return selectedValue.concat(value);
        });
      }
    });
  }, [list]);

  // 切换选中
  function toggleChecked(value: string) {
    // includes判断数组中是否存在：返回布尔值
    const isChecked = selectedValue.includes(value);
    if (isChecked) {
      setSelectedValue((selectedValue) =>
        // 已经存在,筛选掉
        selectedValue.filter((item) => item !== value)
      );
    } else {
      // 否则，添加
      setSelectedValue(selectedValue.concat(value));
    }
  }

  return (
    <>
      <strong
        style={{
          color,
          fontSize: "14px",
          display: "block",
          marginBottom: "5px",
        }}
      >
        {title}
      </strong>
      {/* 隐藏域 */}
      <input type="hidden" name={fe_id} value={selectedValue.toString()} />
      <ul
        className={styles.list}
        style={{
          display: "flex",
          flexWrap: isWrap ? "wrap" : "nowrap",
          justifyContent: "start",
          marginLeft: "-3px",
        }}
      >
        {list.map((opt) => {
          const { value: val, text } = opt;
          // 判断垂直、水平
          let clasName = "";
          if (isVertical) clasName = styles.vertivalItem;
          else clasName = styles.horizontalItem;

          return (
            <li key={val} className={clasName}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedValue.includes(val)}
                  onChange={() => toggleChecked(val)}
                />
                {text}
              </label>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default QuestionCheckbox;
