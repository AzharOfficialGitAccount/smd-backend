import mongoose from 'mongoose';
import { config } from '../config/index';

mongoose.Promise = global.Promise;
const connectionUri = config.mongodbUserUri;

if (!connectionUri) {
  throw new Error('MongoDB URI is not defined in the configuration.');
}

mongoose.connect(connectionUri);
const dbConnection = mongoose.connection;

dbConnection.on('connected', () => {
  console.log('Database connection established successfully');
});

dbConnection.on('error', (err) => {
  console.log(`Database connection has occurred error: ${err}`);
});

dbConnection.on('disconnected', () => {
  console.log(`Database Connection to "${connectionUri}" is disconnected`);
});

export { dbConnection };
