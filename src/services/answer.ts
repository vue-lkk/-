import { post } from "@/services/ajax";
import request from "./request";

// 提交答卷
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export async function postAnswer(answerInfo:any) {
//   const url = '/api/answer'
//   const data = await post(url,answerInfo)
//   return data
// }

export async function postAnswer(answerInfo: any) {
  return request.post(`/api/answer`, answerInfo);
}
