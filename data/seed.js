import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Task from '../task.js';
import data from './seedData.js';

mongoose.connect(process.env.DATABASE_URL);

await Task.deleteMany({});
await Task.insertMany(data, { ordered: true });

mongoose.connection.close();
