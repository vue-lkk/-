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
    const client = await clientPromise;
    const db = client.db("line");
    const { domainName } = req.body;
    console.log(domainName);

    // 感觉域名执行查询
    const result = await db.collection("dataEntries").deleteOne({
      domainName: { $regex: new RegExp(`^${domainName}$`, "i") },
    });

    console.log("###", result);

    if (result.deletedCount > 0) {
      res.status(201).json({
        message: "后台删除成功",
      });
    } else {
      res.status(201).json({
        message: "后台不存在",
        data: {},
      });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
}
