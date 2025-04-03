// question_server项目后端的 host
// const HOST = "http://localhost:3002";
console.log(process.env.NEXT_PUBLIC_API_URL);

// get 请求
export async function get(url: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`);
  const data = res.json();
  return data;
}

// post 请求
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function post(url: string, body: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = res.json();
  return data;
}
