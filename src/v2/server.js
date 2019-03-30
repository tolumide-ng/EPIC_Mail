import express from 'express';
// import cors from 'cors';
import '@babel/polyfill';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import usersRoutes from './routes/usersRoutes';
import messagesRoutes from './routes/messagesRoutes';
import groupsRoutes from './routes/groupsRoutes';

dotenv.config();

const app = express();

// app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'),
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'),
  res.header('Access-Control-Max-Age', 86400);

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Routes
app.use('/api/v2/auth', usersRoutes);
app.use('/api/v2/messages', messagesRoutes);
app.use('/api/v2/groups', groupsRoutes);

app.get('/', (req, res) => res.status(200).json({ status: 200, data: "'YAY!' Welcome to EPIC_Mail (version 2)" }));

// Handle unlisted routes
app.use('*', (req, res) => {
  return res.status(404).json({ status: 404, error: `Route not listed on endpoint`});
})

const port = process.env.PORT || 3000;

app.listen(port, () => { console.log(`server is running on port ${port}`); });

export default app;
