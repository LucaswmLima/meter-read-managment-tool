import express from 'express';
import dotenv from 'dotenv';
import addRouter from './routes/addRoute';
import confirmRouter from './routes/confirmRoute';
import listRouter from './routes/listRoute';


dotenv.config();

require('./config/dbConfig');

const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/add', addRouter);
app.use('/confirm', confirmRouter);
app.use('/', listRouter);
app.use('/uploads', express.static('src/public/uploads'));

app.listen(port, () => {
  console.log(`O servidor está rodando na porta ${port}`);
});
