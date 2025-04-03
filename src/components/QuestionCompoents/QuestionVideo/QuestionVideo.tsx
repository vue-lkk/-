import React, { FC, useEffect, useRef, useState } from "react";
import Plyr, { APITypes, PlyrProps } from "plyr-react";
import "plyr-react/plyr.css";

type PropsTyp = {
  // 不需要 fe_id ,只是展示Title组件，不需要提交数据
  url: string;
  autoplay?: boolean;
  poster?: string;
};

const LkkVideo: FC<PropsTyp> = (props: PropsTyp) => {
  const { url = "", autoplay, poster } = props;
  // console.log(autoplay);
  // 视频封面
  const [videoPoster, setvideoPoster] = useState<string>();

  // 引用播放器实例
  const playerRef = useRef<APITypes>(null);

  // 获取视频某一帧
  useEffect(() => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous"; // 设置跨域
    video.src = url; // 你的视频地址

    const handleLoadedData = () => {
      // 确保视频已经加载完成
      video.currentTime = 0; // 跳到视频开始处
    };

    const handleSeeked = () => {
      // 视频暂停并跳到第一帧后，绘制第一帧到 canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // 设置 canvas 大小为视频的宽高
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // 将第一帧绘制到 canvas 上
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // 将 canvas 转为图片数据 URL
        const imageUrl = canvas.toDataURL("image/jpeg");
        setvideoPoster(imageUrl); // 设置 poster
      }
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      // 清理事件监听器和 DOM 元素
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);

  // 配置 Plyr 的视频选项
  const videoSource: PlyrProps["source"] = {
    type: "video",
    title: "Example Video", // 可选，设置视频标题
    sources: [
      {
        src: url, // 视频地址
        type: "video/mp4", // 视频类型
        size: 720, // 可选，视频分辨率
      },
    ],
    poster: poster ? poster : videoPoster, // 视频封面
  };

  // 使用类型断言为视频元素添加下载属性
  const videoOptions = {
    ...videoSource,
    download: "example-video.mp4", // 下载文件名
  } as PlyrProps["source"];

  return (
    <>
      <Plyr
        ref={playerRef}
        source={videoOptions}
        options={{
          controls: [
            "play-large", // 中间的大播放按钮
            "play", // 播放/暂停按钮
            "progress", //播放进度条
            "current-time", //当前播放时间显示
            "duration", //视频总时长显示
            "mute", //静音按钮
            // 'volume', //音量调节滑块
            "settings", // 设置按钮
            // 'pip', // 画中画模式（部分浏览器支持）
            // 'airplay', // AirPlay 按钮（仅支持 Safari）
            "fullscreen", //全屏切换按钮
            // 'download', // 视频下载按钮
            // 'captions', // 字幕按钮
            // 'remaining-time', //剩余时间显示
          ],
          autoplay,
          muted: true,
          loop: { active: true }, // 启用循环播放
          speed: { selected: 1, options: [0.5, 1, 1.5, 2, 2.5, 3] }, // 设置播放速
          i18n: {
            speed: "播放速度", // 控件名称
            normal: "正常", // 默认速度
          },
          ratio: "12:9", // 宽高比
          captions: { active: true, language: "zh" },
        }}
        // onPlay={handlePlay} // 视频开始播放
        // onPause={handlePause} // 视频暂停播放
      />
    </>
  );
};

export default LkkVideo;
