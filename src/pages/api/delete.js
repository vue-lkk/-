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
    const { nation, lineNameArr } = req.body;
    console.log("###", nation, lineNameArr);

    // 处理删除lineName为null情况
    const lineNameValue = lineNameArr.map((item) =>
      item === "null" ? null : item
    );
    console.log(lineNameValue);

    // 连接数据库
    const client = await clientPromise;
    const db = client.db("line"); // 替换为你的数据库名

    // 批量删除数据
    const result = await db.collection("dataEntries").updateMany(
      { nation },
      {
        $pull: {
          lines: {
            lineName: { $in: lineNameValue }, // 删除指定名称的line号数组
          },
        },
      }
    );
    console.log(result);
    res.status(201).json({
      message: "删除成功",
      data: { ...result },
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
}
