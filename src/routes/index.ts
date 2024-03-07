import express from 'express';
import v1Routes from './v1';

const app = express();

app.use('/v1', v1Routes);

export default app;
