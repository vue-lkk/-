import React, {
  CSSProperties,
  FC,
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Image } from "antd";
import { updateClickNum } from "@/services/question";
import { useRouter } from "next/router";

// 定义FloatButton悬浮按钮属性
export type PropsType = {
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  description?: string; // 内容
  isCenter?: boolean;
  color?: string;
  borderRadius?: number;
  background?: string;
  backgroundImage?: string;
  zIndex?: number; // 层级
  position?: "top" | "left" | "custom"; //位置
  fontSize?: number;
  onFloatBtnName?: string; // 点击事件
  lines?: Array<string>;

  onChange?: (options: PropsType) => void; // 事件
  disabled?: boolean; // 禁用 form 修改属性
};

type FloatBtnAction = {
  [key: string]: () => void; // 允许任意字符串作为键
};

const LkkFloatButton: FC<PropsType> = ({
  width,
  height = 0,
  left,
  top,
  description,
  isCenter,
  color,
  borderRadius,
  background,
  backgroundImage,
  zIndex = 1,
  position,
  fontSize,
  // onFloatBtnName,
  lines = [],
}) => {
  // 获取动态路由参数
  const router = useRouter();
  const { id } = router.query;

  // 事件对象
  const floatBtnActions: FloatBtnAction = {
    click: async () => {
      window.open(lines[0], "_self");
      // 更新点击数量
      await updateClickNum(id as string, lines[0]);
    },
  };

  // 位置样式
  const [postionStyle, setPostionStyle] = useState<React.CSSProperties>({
    fontSize: `${fontSize}px`,
    position: "fixed",
    width: "0px", // 初始值可以是任何值
    height: "0px",
    zIndex,
    top: "0px",
    left: "0px",
  });

  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [windowHeight, setWindowHeight] = useState<number>(0);
  // 获取窗口宽度和高度
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    // 初始化时调用一次
    updateWindowSize();

    // 添加监听事件
    window.addEventListener("resize", updateWindowSize);

    // 清除监听事件
    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, []);

  // 根据窗口宽度和高度以及 position 更新样式
  useEffect(() => {
    let updatedStyle = { ...postionStyle };

    switch (position) {
      case "custom":
        // console.log(top, left, width, height);
        updatedStyle = {
          ...updatedStyle,
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          height: `${height}px`,
        };
        break;

      case "top":
        updatedStyle = {
          ...updatedStyle,
          top: "0px",
          left: "0px",
          width: `${windowWidth}px`,
          height: `${height}px`,
        };
        break;

      case "left":
        updatedStyle = {
          ...updatedStyle,
          top: `${windowHeight - height}px`,
          left: "0px",
          width: `${windowWidth}px`,
          height: `${height}px`,
        };
        break;

      default:
        updatedStyle = {
          ...updatedStyle,
          top: "0px",
          left: "0px",
        };
    }

    setPostionStyle(updatedStyle);
  }, [position, windowWidth, windowHeight, width, height, top, left]);

  return (
    <div style={postionStyle}>
      {
        <a
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: isCenter ? "center" : "start",
            alignItems: "center",
            color: color,
            borderRadius: borderRadius,
            background: background,
            boxShadow: "0px 0px 10px 2px #a19d9d",
            overflow: "hidden",
          }}
          // onClick={btn}
          onClick={floatBtnActions["click"]}
        >
          {/* 文本内容 */}
          {!backgroundImage && (
            <>
              {/* 文本内容 */}
              <div>{description}</div>
            </>
          )}

          {/* 图片 */}
          {backgroundImage && (
            <Image
              alt=""
              width={position === "custom" ? width : "100%"}
              height={height}
              src={backgroundImage}
              preview={false}
            />
          )}
        </a>
      }
    </div>
  );
};

export default LkkFloatButton;
