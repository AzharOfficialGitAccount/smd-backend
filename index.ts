import express, { Express } from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { dbConnection } from './src/config/database';
import { errorHandler } from './src/middleware';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes';

dotenv.config();

const app: Express = express();

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  next();
});

app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

const httpServer = http.createServer(app);

httpServer.listen(process.env.PORT, () => {
  console.info(`Server up successfully - port: ${process.env.PORT}`);
});

app.use('/api', routes);

app.use(errorHandler.methodNotAllowed);
app.use(errorHandler.genericErrorHandler);

process.on('unhandledRejection', (err: unknown) => {
  console.error('Possibly unhandled rejection happened');
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error('Unhandled rejection:', err);
  }
});

const closeHandler = async () => {
  try {
    await dbConnection.close();
    console.info('Database connection closed successfully');
    httpServer.close(() => {
      console.info('Server is stopped successfully');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error closing database connection:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', closeHandler);
process.on('SIGINT', closeHandler);
