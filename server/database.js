const mongoose = require('mongoose');

const db = process.env.MONGO_URI; // подключение через env

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false); // Установите strictQuery значение
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
