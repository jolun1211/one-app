import assert from 'assert';

const { MongoClient } = require('mongodb');
const { EventEmitter } = require('events')

const dbUrl = 'mongodb://localhost:27017';
const client = new MongoClient(dbUrl, { useNewUrlParser: true });
const DB_Name = 'one-app';
const tableName = 'test';

let cof = {
  url: dbUrl,
  dbName: DB_Name
}

// const dbConnect = function () {
//   return new Promise<void>((resolve, reject) => {
//     try {
//       client.connect(async (err: any) => {
//         assert.equal(null, err);
//         const db = client.db(dbName);
//         console.log("Connected successfully to server");
//         const collection = db.collection(tableName);

//         await collection.find({ id: 1 }, (err: Error, res: any) => {
//           console.log("结果", res)
//         })

//         collection.insertMany([
//           {id:1,username:"test"}
//         ], function(err: any, result:any) {

//           console.log("Inserted 3 documents into the collection",result);
//           // callback(result);
//         });
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// export default dbConnect;

class Mongodb {
  conf: IConfg;
  emmiter: any;
  client: any;

  constructor(conf = cof) {
    this.conf = conf
    this.emmiter = new EventEmitter()
    this.client = new MongoClient(conf.url, {
      useNewUrlParser: true
    })
    this.client.connect((err: any) => {
      if (err) throw err
      console.log('连接成功')
      this.emmiter.emit('connect')
    })


  }
  col(colName = tableName, dbName = DB_Name) {
    return this.client.db(dbName).collection(colName)
  }
  once(event: any, cb: any) {
    this.emmiter.once(event, cb)
  }
}

export default Mongodb;

interface IConfg {
  url?: string;
  dbName?: string
}