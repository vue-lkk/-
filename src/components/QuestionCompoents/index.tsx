// 输入框组件
import QuestionInput from "./QuestionInput/QuestionInput";
// 单选框组件
import QuestionRadio from "./QuestionRadio/QuestionRadio";
// 标题组件
import QuestionTitle from "./QuestionTitle/QuestionTitle";
// 一行段落组件
import QuestionParagrapg from "./QuestionParagraph/QuestionParagraph";
// 问卷标题组件
import QuestionInfo from "./QuestionInfo/QuestionInfo";
// 多行输入组件
import QuestionTextarea from "./QuestionTextarea/QuestionTextarea";
// 多选框组件
import QuestionCheckbox from "./QuestionCheckbox/QuestionCheckbox";
// 轮播图
import QuestionCarousel from "./QuestionCarousel/QuestionCarousel";
import QuestionImage from "./QuestionImage/QuestionImage";
import QuestionFloatButton from "./QuestionFloatButton/QuestionFloatButton";
import QuestionButton from "./QuestionButton/QuestionButton";
import QuestionSpace from "./QuestionSpace/QuestionSpace";
import QuestionList from "./QuestionList/QuestionList";
import QuestionVideo from "./QuestionVideo/QuestionVideo";

type ComponentInfoType = {
  fe_id: string;
  type: string; // 组件类型：不能重复，前后端统一好
  title: string;
  isHidden: boolean; // 隐藏/显示
  props: any;
};

type checkeLine = {
  clickNum: number;
  comment: string;
  lineName: string;
  link: string;
  pixels: string;
  showDocumentNum: number;
  status: number;
  switch: number;
};

export const getComponent = (
  comp: ComponentInfoType,
  checkeLines: checkeLine[]
) => {
  const { fe_id, type, isHidden, props } = comp;
  // console.log(checkeLines);
  const lines = checkeLines.map((line) => line.link);

  if (isHidden) return null;

  // 输入框
  if (type === "questionInput") {
    return <QuestionInput fe_id={fe_id} props={props} />;
  }
  // 单选框
  if (type === "questionRadio") {
    return <QuestionRadio fe_id={fe_id} props={props} />;
  }
  // 标题
  if (type === "questionTitle") {
    return <QuestionTitle {...props} />;
  }
  // 一行段落
  if (type === "questionParagraph") {
    return <QuestionParagrapg {...props} />;
  }
  // 问卷标题
  if (type === "questionInfo") {
    return <QuestionInfo {...props} />;
  }
  // 多行输入
  if (type === "questionTextarea") {
    return <QuestionTextarea fe_id={fe_id} props={props} />;
  }
  // 多选框
  if (type === "questionCheckbox") {
    return <QuestionCheckbox fe_id={fe_id} props={props} />;
  }
  // 轮播图
  if (type === "questionCarousel") {
    return <QuestionCarousel {...props} />;
  }
  // 图片
  if (type === "questionImage") {
    return <QuestionImage {...props} />;
  }
  // 浮动按钮
  if (type === "H5FloatButton") {
    return <QuestionFloatButton {...props} lines={lines} />;
  }
  //普通按钮
  if (type === "LkkButton") {
    return <QuestionButton {...props} lines={lines} />;
  }
  // 间隔
  if (type === "H5Space") {
    return <QuestionSpace {...props} />;
  }
  // 列表
  if (type === "H5List") {
    return <QuestionList {...props} />;
  }
  // 视频
  if (type === "LkkVideo") {
    return <QuestionVideo {...props} />;
  }
};
