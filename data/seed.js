import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import data from './mock.js';
import Task from '../models/task.js';

mongoose.connect(process.env.DATABASE_URL);

await Task.deleteMany({});
await Task.insertMany(data);

mongoose.connection.close();
