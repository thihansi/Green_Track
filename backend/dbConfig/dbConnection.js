import mongoose from 'mongoose';
// Singleton design pattern applied to the DB connection 
let dbInstance = null;

const dbConnection = async () => {
  try {
    if (dbInstance) {
      console.log('Reusing existing DB connection');
      return dbInstance;
    }

    dbInstance = await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('DB Connected Successfully');

    return dbInstance;
  } catch (error) {
    console.log('DB Error: ' + error);
    throw error;
  }
};

export default dbConnection;