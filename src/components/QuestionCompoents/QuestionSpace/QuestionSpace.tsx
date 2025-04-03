import React, { FC } from "react";

type PropsType = {
  height?: number;
};

const LkkSpace: FC<PropsType> = ({ height }) => {
  return (
    <div
      style={{
        width: "100%",
        height: `${height}px`,
        background: "#fff",
      }}
    ></div>
  );
};

export default LkkSpace;
