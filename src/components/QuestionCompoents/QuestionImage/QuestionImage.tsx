import React, { FC, useEffect, useRef, useState } from "react";
import { Image } from "antd";
import { useInViewport } from "ahooks";

type PropsTyp = {
  src?: string; //图片路径
  placeholder?: string;
  width?: number;
  height?: number;
  isCenter?: boolean;
  border?: number;
  borderRadius?: number;
};

const QuestionImage: FC<PropsTyp> = (props: PropsTyp) => {
  // 默认属性 与 props合并
  const { src, width, height, isCenter, border, borderRadius, placeholder } =
    props;

  const imgRef = useRef<HTMLDivElement>(null); // 使用 div 作为外层容器
  const [loaded, setLoaded] = useState(false);
  const [inViewport] = useInViewport(imgRef); // 判断组件是否进入可视口

  useEffect(() => {
    console.log(inViewport);
  }, [inViewport]);

  return (
    <div
      ref={imgRef}
      style={{
        width: "100%",
        height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "#eee",
      }}
    >
      <Image
        width={width}
        height={height}
        style={{
          border: `${border}px solid #ccc`,
          borderRadius: `${borderRadius}px`,
          padding: border ? "3px" : "0px",
          opacity: loaded ? 1 : 0.5, // 过渡效果
          transition: "opacity 0.5s ease-in-out",
        }}
        placeholder={loaded} // antd 自带 loading 效果
        src={
          inViewport ? src : "https://266aaa111.shop:9902/uploads/loading.png"
        } // 进入视口才加载真实图片
        onLoad={() => setLoaded(true)}
        // preview={{ visible: false }} // 可选：如果不需要 antd 预览功能
        // alt="loading"
      />
    </div>
  );
};
export default QuestionImage;
