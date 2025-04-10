import request from "./request";

// 根据域名获取单个后台
export async function getQuestionByDomainName(domainName: string) {
  return request.get(`/api/check?domainName=${domainName}`);
}

// 上线/下线
export async function toggleLink(data: any) {
  return request.post(`/api/updateline`, data);
}

// 根据域名统一修改当前域名像素
export async function updatePixelsByDomainName(data: any) {
  return request.post(`/api/update`, data);
}

// 批量添加-根据国家来批量统一添加
export async function addByNation(data: string) {
  return request.post(`/api/add`, data);
}

// 批量添加-根据国家来批量统一删除
export async function deleteByNation(data: string) {
  return request.post(`/api/delete`, data);
}

// 新建后台
export async function createByNation(data: string) {
  return request.post(`/api/create`, data);
}

// 新建后台模板
export async function createTemplate(data: string) {
  return request.post(`/api/template`, data);
}

// 封禁/解封
export async function updateBanned(data: any) {
  return request.post(`/api/banned`, data);
}

// 获取上线
export async function getToLines(data: string) {
  return request.get(`/api/gettopline?domainName=${data}`);
}

// 重置点击量
export async function updateResetClick(data: any) {
  return request.post(`/api/clearclick`, data);
}

// 获取模板后台
export async function getQuestionByuserName(userName: string) {
  return request.get(`/api/checkbyusername?userName=${userName}`);
}

// 根据用户名查询所有后台
export async function checkbyusername(data: string) {
  return request.get(`/api/checkbyusername?userName=${data}`);
}

// 根据用户名查询所有后台
export async function checkbyusernameAndNation(
  userName: string,
  nation: string
) {
  return request.get(
    `/api/heckbyusernameAndNation?userName=${userName}&nation=${nation}`
  );
}

// 根据用户名+域名数组批量删除后台
export async function deletebydomainNameArr(data: any) {
  return request.post(`/api/deletebackstage`, data);
}
