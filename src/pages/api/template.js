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
    const { userName, domainName, nation } = req.body;
    console.log(userName, domainName, nation);

    // 验证必要字段
    if (!userName || !domainName || !nation) {
      return res.status(400).json({ message: "用户名称、域名、国家为必填项" });
    }

    // 连接数据库
    const client = await clientPromise;
    const db = client.db("line"); // 替换为你的数据库名

    let lines = "";
    // 构建数据格式
    function createlineList() {
      switch (nation) {
        case "日本-减肥":
          lines = [
            "https://lin.ee/tgP6Rr7,芙蓉,@577fmvgs", //2  芙蓉	@577fmvgs
            "https://lin.ee/8VlH1q6,芙蓉,@158demzd", //3  芙蓉	@158demzd
            "https://lin.ee/orKoYKX,芙蓉,@694vxxln", //4  芙蓉	@694vxxln
            "https://lin.ee/6a0pLNi,芙蓉,@929tukav", //5  芙蓉	@929tukav
            "https://lin.ee/ww3AYld,芙蓉,@598lvbse", //6  芙蓉	@598lvbse
            "https://lin.ee/s2p0QZs,芙蓉,@884pjcnh", //7  芙蓉	@884pjcnh
            "https://lin.ee/zPILsOm,芙蓉,@847xxzhm", //8  芙蓉	@847xxzhm
            "https://lin.ee/lcD7PJs,香草,@176hgzlh", //9  香草	@176hgzlh
            "https://lin.ee/GrFEXnU,香草,@961senzs", //10 香草	@961senzs
            "https://lin.ee/URvZE8h,香草,@708idawv", //11 香草	@708idawv
            "https://lin.ee/GxfeO30,芙蓉,@346nbnko", //12 芙蓉	@346nbnko
            "https://lin.ee/tn6itxY,芙蓉,@611kbyxl", //17 芙蓉	@611kbyxl
            "https://lin.ee/QqannGP,芙蓉,@855lrvck", //21 芙蓉	@855lrvck
            "https://lin.ee/bJFkG05,芙蓉,@342poxot", //22 芙蓉	@342poxot
            "https://lin.ee/saYlFeL,芙蓉,@470nhzvp", //27 芙蓉	@470nhzvp
            "https://lin.ee/2Lf8SZV,芙蓉,@841qrabu", //31 芙蓉	@841qrabu
            "https://lin.ee/qhkkKkm,芙蓉,@651abnps", //34 芙蓉	@651abnps
            "https://lin.ee/nnWCxip,芙蓉,@052kqotw", //35 芙蓉	@052kqotw
            "https://lin.ee/qxrtH2c,香草,@884lgmet", //36 香草	@884lgmet
            "https://lin.ee/kmgpEfu,芙蓉,@125kpdjx", //37 芙蓉	@125kpdjx
            "https://lin.ee/5VPdho9,芙蓉,@168evegl", //38 芙蓉	@168evegl
            "https://lin.ee/6Q2KzYe,芙蓉,@975dnkbv", //40 芙蓉	@975dnkbv
            "https://lin.ee/bH5oIj6,芙蓉,@746bvsjs", //41 芙蓉	@746bvsjs
            "https://lin.ee/Ku2WucK,香草,@665osfqs", //42 香草	@665osfqs
            "https://lin.ee/EuqxAZ1,芙蓉,@984puauu", //44 芙蓉	@984puauu
            "https://lin.ee/4TmostP,芙蓉,@218dsbhd", //48 芙蓉	@218dsbhd
            "https://lin.ee/QW6kYx7,芙蓉,@102rfudc", //52 芙蓉	@102rfudc
            "https://lin.ee/l2CNpl7,芙蓉,@464lihko", //54 芙蓉	@464lihko
            "https://lin.ee/56UGznF,芙蓉,@819tjemh", //56 芙蓉	@819tjemh
            "https://lin.ee/BLEXPfD,芙蓉,@770adziw", //57 芙蓉	@770adziw
            "https://lin.ee/ENl7P7P,芙蓉,@065avxxz", //58 芙蓉	@065avxxz
            "https://lin.ee/TCd2e7B,芙蓉,@219qercw", //59 芙蓉	@219qercw
            "https://lin.ee/hYRUfBF,芙蓉,@607flkoj", //60 芙蓉	@607flkoj
            "https://lin.ee/13tNbBh,芙蓉,@021rqdrd", //61 芙蓉	@021rqdrd
            "https://lin.ee/rHiE4aR,芙蓉,@464lihko", //62 芙蓉	@464lihko
            "https://lin.ee/FlhN7e3,芙蓉,@977ygdgo", //63 芙蓉	@977ygdgo
            "https://lin.ee/vkWDhEM,芙蓉,@795oxwyt", //64 芙蓉	@795oxwyt
            "https://lin.ee/GSdZXy6,芙蓉,@444jbbut", //65 芙蓉	@444jbbut
          ];
          break;
        case "韩国-减肥":
          lines = [
            "http://pf.kakao.com/_DCxfCn/chat,312,iem001",
            "http://pf.kakao.com/_jxikCn/chat,飞跃,709jsf",
          ];
          break;
        case "日本-男科":
          lines = [
            "https://works.do/5J7G6uR,男科,4532",
            "https://works.do/xQIUItm,男科,qfy162",
            "https://works.do/52LoLYw,男科,qfy956",
            "https://works.do/FoC8NXz,男科,qfy746",
            "https://works.do/5TI5A0p,男科,qfy553",
          ];
          break;
        case "韩国-男科":
          lines = [];
          break;
        case "日本-丰胸":
          lines = [
            "https://line.me/R/ti/p/@112fquyb,丰胸,@112fquyb",
            "https://line.me/R/ti/p/@429cpyky,丰胸,@429cpyky",
            "https://line.me/R/ti/p/@358oezlx,丰胸,@358oezlx",
            "https://line.me/R/ti/p/@647lnwpj,丰胸,@647lnwpj",
          ];
          break;
        default:
          lines = [];
          break;
      }

      const data = lines.map((line) => {
        // 以 ',' 分割数据
        const spliceLine = line.toString().split(",");
        // 数据格式
        const obj = {
          status: 0, // 上线/下线(0为下线)
          comment: spliceLine[1], // 备注
          lineName: spliceLine[2], // line号名称
          link: spliceLine[0], // line链接
          pixels: "123456789", // 广告像素
          clickNum: 0, // 点击次数
        };
        return obj;
      });
      return data;
    }

    // 构建数据对象
    const dataEntry = {
      userName, // 用户名称
      domainName, // 域名名称
      nation, // 国家
      lines: createlineList() || [], // line所有相关信息
      createdAt: new Date(),
    };

    // 是否已经创建过后台
    const validDomainName = await db
      .collection("dataEntries")
      .findOne({ domainName });

    console.log(validDomainName);
    if (validDomainName) {
      res.status(201).json({
        code: 202,
        message: "后台模板已存在，无需再创建",
      });
    } else {
      // 插入数据库
      const result = await db.collection("dataEntries").insertOne(dataEntry);

      res.status(201).json({
        code: 201,
        message: "后台模板创建成功",
        data: { ...dataEntry, _id: result.insertedId },
      });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
}
