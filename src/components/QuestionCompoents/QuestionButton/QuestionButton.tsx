import React, { FC, useEffect, useState } from "react";
import { Button, ConfigProviderProps } from "antd";
import { useRouter } from "next/router";
import { updateClickNum } from "@/services/question";
type SizeType = ConfigProviderProps["componentSize"];

// 定义LkkButton按钮属性
type PropsTyp = {
  title?: string;
  width?: number;
  height?: number;
  types?: "primary" | "dashed" | "text" | "link";
  sizes?: "large" | "middle" | "small";
  bgColor?: string;
  color?: string;
  onBtnName?: string; // 点击事件
  lines?: Array<string>;
};

type FloatBtnAction = {
  [key: string]: () => void; // 允许任意字符串作为键
};

const LkkButton: FC<PropsTyp> = ({
  title,
  width,
  height,
  types,
  sizes,
  bgColor,
  color,
  lines = [],
}) => {
  const [size, setSize] = useState<SizeType>(sizes); // default is 'middle'

  const router = useRouter();
  const { id } = router.query; // 获取动态路由参数
  const floatBtnActions: FloatBtnAction = {
    click: async () => {
      window.open(lines[0], "_self");
      // 更新点击数量
      await updateClickNum(id as string, lines[0]);
    },
  };

  useEffect(() => {
    setSize(sizes);
  }, [sizes]);

  return (
    <div style={{ textAlign: "center" }}>
      <a onClick={floatBtnActions["click"]}>
        <Button
          type={types}
          size={size}
          style={{
            width: `${width}%`,
            height: `${height}px`,
            background: `${bgColor}`,
            color: `${color}`,
          }}
        >
          {title}
        </Button>
      </a>
    </div>
  );
};

export default LkkButton;
