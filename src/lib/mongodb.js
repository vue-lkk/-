import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
// const uri = "mongodb://127.0.0.1:27017/mydb";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // 连接池大小
  serverSelectionTimeoutMS: 5000,
};

let client;
let clientPromise;

if (!uri) throw new Error("缺少 MONGODB_URI 环境变量");

// 开发环境使用全局缓存
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
