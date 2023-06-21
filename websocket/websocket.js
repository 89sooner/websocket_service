const WebSocket = require('ws');
const { MongoClient } = require('mongodb');

const wss = new WebSocket.Server({ port: 9002 });

// Connect to MongoDB
const uri = "mongodb://admin:password@localhost:27017/?authMechanism=DEFAULT";
const client = new MongoClient(uri, { useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      console.log("Connected to MongoDB");
  
      const collection = client.db("mydatabase").collection("mycollection");
  

      wss.on('connection', ws => {
        console.log('Client connected');
  
        ws.on('message', message => {
          let stringMessage = message.toString();
          if (stringMessage === 'request') {
            let lastData = null;
  
            setInterval(async () => {
              const items = await collection.find().sort({_id: -1}).limit(1).toArray();
        
              if (!lastData || items[0]._id.toString() !== lastData._id.toString()) {
                lastData = items[0];
        
                wss.clients.forEach(client => {
                  if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(items));
                  }
                });
              }
            }, 1000); // 1초마다 데이터베이스를 조회합니다.
          }
        });

        ws.on('close', () => {
          console.log('Client disconnected');
        });
      });


    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
    }
  }

/* async function run() {
    try {
      await client.connect();
      console.log("Connected to MongoDB");

      const collection = client.db("mydatabase").collection("mycollection");

      const changeStream = collection.watch();

    //   changeStream.on('change', async (change) => {
    //     console.log(change);
    //     const items = await collection.find().sort({_id: -1}).limit(1).toArray();
  
    //     wss.clients.forEach(client => {
    //       if (client.readyState === WebSocket.OPEN) {
    //         client.send(JSON.stringify(items));
    //       }
    //     });
    //   });

    //   wss.on('connection', ws => {
    //     console.log('Client connected');
  
    //     ws.on('message', async message => {
    //       console.log(`Received: ${message}`);
    //       let stringMessage = message.toString();
    //       console.log(`Converted to string: ${stringMessage}`);
    //       if (stringMessage === 'request') {
    //         const items = await collection.find().sort({_id: -1}).limit(1).toArray();
    //         ws.send(JSON.stringify(items))
    //       }
    //     });

    //     ws.on('close', () => {
    //       console.log('Client disconnected');
    //     });
    //   });

    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
    }
  } */
  
  run();