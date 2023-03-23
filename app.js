import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import Task from './task.js';

const app = express();
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL);

app.get('/tasks', async (req, res) => {
  /** 쿼리 목록
   *  - count: 아이템 개수
   *  - sort: 정렬
   */
  const count = Number(req.query.count) || 0;
  const sort = req.query.sort || 'newest';
  const tasks = await Task.find()
    .limit(count)
    .sort([['createdAt', sort === 'newest' ? 'desc' : 'asc']]);
  res.send(tasks);
});

app.get('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: 'Task not found' });
  }
});

app.post('/tasks', async (req, res) => {
  const newTask = await Task.create(req.body);
  res.send(newTask);
});

app.patch('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    const { body } = req;
    Object.keys(body).forEach((key) => {
      task[key] = body[key];
    });
    await task.save();
    res.send(task);
  } else {
    res.status(404).send({ message: 'Task not found' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (task) {
    res.sendStatus(200);
  } else {
    res.status(404).send({ message: 'Task not found' });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
