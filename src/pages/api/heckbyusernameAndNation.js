import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  // 处理 CORS 预检请求
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // 设置 CORS 头
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("line");
    const { userName, nation } = req.query;
    console.log(userName, nation);

    // 根据用户名称执行查询
    const result = await db
      .collection("dataEntries")
      .find({
        userName: { $regex: new RegExp(`^${userName}$`, "i") },
        nation,
      })
      .toArray();

    console.log(result);

    if (result.length > 0) {
      res.status(201).json({
        message: "查询成功",
        data: result,
      });
    } else {
      res.status(201).json({
        message: "暂无后台",
        data: [],
      });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
}
