import clientPromise from "../../lib/mongodb";

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

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { banned } = req.body;
    console.log("###", banned);

    // 连接数据库
    const client = await clientPromise;
    const db = client.db("line"); // 替换为你的数据库名

    // 一键封禁/解封
    const result = db.collection("dataEntries").updateMany(
      {
        userName: { $ne: "lkk" }, // 使用$ne操作符匹配不等于"lkk"的文档
      },
      {
        $set: { banned }, // 明确使用$set操作符更新字段
      }
    );

    console.log(result);

    res.status(201).json({
      message: banned ? "封禁" : "解封",
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
}
