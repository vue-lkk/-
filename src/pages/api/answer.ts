import { postAnswer } from "@/services/answer";
import type { NextApiRequest, NextApiResponse } from "next";

type BodyType = {
  [key: string]: string;
};
type AnswerType = {
  componentId: string;
  value: string;
};

// 用户提交数据
function genAnswerInfo(reqBody: BodyType) {
  const answerList: AnswerType[] = [];
  Object.keys(reqBody).forEach((key) => {
    if (key === "questionId") return;
    answerList.push({
      componentId: key,
      value: reqBody[key],
    });
  });
  return {
    // 问卷id
    questionId: reqBody.questionId || "",
    // 答卷数据
    answerList,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    // 不是 post请求 则返回错误
    res.status(200).json({ error: -1, msg: "Method 错误" });
  }
  // 获取到表单提交过来的数据
  console.log("表单数据", req.body);
  // 获取并格式化表单数据
  const answerInfo = genAnswerInfo(req.body);
  console.log("收集好的提交数据：", answerInfo);

  // 此时，将数据提交到服务器端
  try {
    // TODO 提交到服务器
    const result = await postAnswer(answerInfo);
    console.log("提交成功返回的数据", result);

    // 如果提交成功了
    // return res.redirect("/success");
    if (result && req.method === "POST") {
      // 处理 POST 请求逻辑
      return res.redirect(302, "/success");
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }

    // 如果提交失败了
    res.redirect("/fail");
  } catch (error) {
    // 如果提交失败了
    console.log(error);
    res.redirect("/fail");
  }

  res.status(200).json({ code: 0 });
}
