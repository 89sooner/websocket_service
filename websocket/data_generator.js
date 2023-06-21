const { MongoClient } = require('mongodb');

const uri = "mongodb://admin:password@localhost:27017/?authMechanism=DEFAULT";
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    
    setInterval(async () => {
      const collection = client.db("mydatabase").collection("mycollection");
      
      const data = {
        timestamp: new Date(),
        value: Math.random() // 또는 실제로 필요한 데이터로 대체하세요.
      };
      
      const result = await collection.insertOne(data);
      console.log(`New document inserted: ${result.insertedId}`);
    }, 1000); // 1초마다 새 데이터를 추가합니다.
  } catch(err) {
    console.error(err);
  }
}

run();
