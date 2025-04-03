import React, { FC } from "react";
import { Carousel, ConfigProvider, Image } from "antd";

export type SrcArrType = {
  name: string;
  status: string;
  uid: string;
  url: string;
};

export enum Position {
  "top" = "top",
  "left" = "left",
  "bottom" = "bottom",
  "right" = "right",
}

export enum Effect {
  "scrollx" = "scrollx",
  "fade" = "fade",
}

type PropsTyp = {
  width?: number;
  height?: number;
  srcArr?: SrcArrType[]; // 轮播图片列表
  autoplay?: boolean; // 自动轮播
  autoplaySpeed?: number; //	自动切换的间隔
  arrows?: boolean; // 显示箭头
  dotPosition?: Position; // 轮播方向
  effect?: Effect; // 动画效果函数

  arrowOffset?: number;
  arrowSize?: number;
  dotActiveWidth?: number;
  dotHeight?: number;
  dotWidth?: number;
  dotGap?: number;
  dotOffset?: number;
  draggable?: boolean;
  dots?: boolean;
  colorBgContainer?: string; // 组件的容器背景色
};

// 轮播图
const QuestionCarousel: FC<PropsTyp> = ({
  width,
  height,
  srcArr,
  autoplay,
  autoplaySpeed,
  arrows,
  dotPosition = Position.bottom, // 轮播方向
  effect = Effect.scrollx, // 动画效果函数

  arrowOffset,
  arrowSize,
  dotActiveWidth,
  dotHeight,
  dotWidth,
  dotGap,
  dotOffset,
  draggable,
  dots,
  colorBgContainer,
}) => {
  // useEffect(() => {
  //   console.log(arrows);
  // }, []);
  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "100%",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#fff",

    // height: "100%",
    // width: "100%",
    // display: "inline-block",
    // textAlign: "center",
    // lineHeight: "50%",
    // color: "#000",
    // background: "rgb(236 236 236)",
    // overflow: "hidden",
  };

  const imgStyle: React.CSSProperties = {
    height: height + "px",
    width: width + "px",
    display: "inline-block",
    textAlign: "center",
    color: "#000",
    background: "rgb(236 236 236)",
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Carousel: {
            /* 这里是你的组件 token */
            arrowOffset,
            arrowSize,
            dotActiveWidth,
            dotHeight,
            dotWidth,
            dotGap,
            dotOffset,
            colorBgContainer, // 组件的容器背景色，例如：默认按钮、输入框等
            colorText: "#000",
          },
        },
      }}
    >
      <Carousel
        dotPosition={dotPosition}
        effect={effect}
        autoplay={autoplay}
        autoplaySpeed={autoplaySpeed! * 1000}
        arrows={arrows}
        infinite
        draggable={draggable}
        dots={dots}
      >
        {srcArr?.map((src, index) => {
          const { url } = src;
          return (
            <div key={index}>
              <h3 style={contentStyle}>
                <Image style={imgStyle} src={url} preview={false} alt="" />
              </h3>
            </div>
          );
        })}
      </Carousel>
    </ConfigProvider>
  );
};

export default QuestionCarousel;
