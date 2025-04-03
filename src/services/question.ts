import { get } from "./ajax";
import request from "./request";

// 获取问卷
// export async function getQuestionById(id: string) {
//   const url = `/api/question/${id}`;
//   const data = await get(url);
//   return data;
// }
// 获取问卷
// 获取单个问卷
export async function getQuestionById(id: string) {
  return request.get(`/api/question/${id}`);
}

// 获取line表
// export async function getLineByDomainName(domainName: string) {
//   const url = `/api/line?domainName=${domainName}`;
//   const data = await get(url);
//   return data;
// }
export async function getLineByDomainName(domainName: string) {
  return request.get(`/api/line?domainName=${domainName}`);
}

// 更新页面展示次数
// export async function updateShowDocNum(domainName: string, link: string) {
//   const url = `/api/line/showdocumentnum?domainName=${domainName}&link=${link}`;
//   const data = await get(url);
//   return data;
// }
export async function updateShowDocNum(domainName: string, link: string) {
  return request.get(
    `/api/line/showdocumentnum?domainName=${domainName}&link=${link}`
  );
}

// 更新点击次数
// export async function updateClickNum(domainName: string, link: string) {
//   const url = `/api/line/clicknum?domainName=${domainName}&link=${link}`;
//   const data = await get(url);
//   return data;
// }
export async function updateClickNum(domainName: string, link: string) {
  return request.get(
    `/api/line/clicknum?domainName=${domainName}&link=${link}`
  );
}
