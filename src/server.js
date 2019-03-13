import express from 'express';
import '@babel/polyfill';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import usersV1Routes from './v1/routes/usersRoutes';
import messagesV1Routes from './v1/routes/messagesRoutes';

dotenv.config();

const usersRoutes = process.env.NODE_VERSION === 'v2' ? usersV2Routes : usersV1Routes;
const messagesRoutes = process.env.NODE_VERSION === 'v2' ? messagesV2Routes : messagesV1Routes;


const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api/v1/auth', usersRoutes);
app.use('/api/v1/messages', messagesRoutes);

app.get('/', (req, res) => res.status(200).json({ status: 200, data: "'YAY!' Welcome to EPIC_Mail" }));


// Handle unavailable routes
app.use((req, res, next) => {
  const error = new Error('Route not listed in endpoints, Not found');
  error.status = 400;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ status: error.status || 500, error: `This error is thrown because ${error.name}, ${error.message}` });
});

const port = process.env.PORT || 3000;

app.listen(port, () => { console.log(`server is running on port ${port}`); });

export default app;
