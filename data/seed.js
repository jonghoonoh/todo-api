import mongoose from 'mongoose';
import data from './mock.js';
import Task from '../models/task.js';
import { DATABASE_URL } from '../constants.js';

mongoose.connect(DATABASE_URL);

await Task.deleteMany({});
await Task.insertMany(data);

mongoose.connection.close();
