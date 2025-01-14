const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', true);

const main = async () => {
  await mongoose.connect(process.env.DB_URI);
  console.log('DB Conectado com sucesso!');
};

main().catch((err) => console.log(err));

module.exports = main;
