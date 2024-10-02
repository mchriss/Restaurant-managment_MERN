import { mongoose } from 'mongoose';

const atlasUri = 'mongodb://mkim2052:mkim2052@webprog-shard-00-00.z6wae.mongodb.net:27017,webprog-shard-00-01.z6wae.mongodb.net:27017,webprog-shard-00-02.z6wae.mongodb.net:27017/Restaurant_reservations?ssl=true&replicaSet=atlas-xwi81g-shard-0&authSource=admin&retryWrites=true&w=majority';

export default function createConnection() {
  mongoose.connect(atlasUri, {
    minPoolSize: 5,
    maxPoolSize: 10,
  }).then(() => console.log('Database Created'))
    .catch((err) => console.log(err));
}
