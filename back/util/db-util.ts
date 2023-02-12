import { Collection, MongoClient, ServerApiVersion } from 'mongodb';

const url =
  'mongodb+srv://mohelmy:xJka4LH9GuEoF3xW@cluster0.s13ivsk.mongodb.net/godzilla?retryWrites=true&w=majority';

export const dbConnect = async (
  collectionName: string,
  callback: (collection: Collection) => Promise<void>
) => {
  let client;
  try {
    const mongoClient = new MongoClient(url, {
      serverApi: ServerApiVersion.v1,
    });
    client = await mongoClient.connect();

    const collection = client.db().collection(collectionName);

    await callback(collection);
  } catch (error) {
    // throw new Error();
    throw error;
  } finally {
    if (client) await client.close();
  }
};

// var db = null; // global variable to hold the connection

// MongoClient.connect('mongodb://localhost:27017/', function (err, client) {
//   if (err) {
//     console.error(err);
//   }
//   if( client) {
//     db = client.db('test'); // once connected, assign the connection to the global variable
//   }
// });
