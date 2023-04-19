import express from 'express';
import mongoose from 'mongoose';
import mockTasks from './data/mock.js';
import { DATABASE_URL } from './constants.js';
import Task from './models/task.js';

mongoose.connect(DATABASE_URL).then(() => console.log('Connected to DB'));

const app = express();
app.use(express.json());

app.get('/tasks', async (req, res) => {
  /** 쿼리 파라미터
   *  - sort: 'oldest'인 경우 오래된 태스크 기준, 나머지 경우 새로운 태스크 기준
   *  - count: 태스크 개수
   */
  const sort = req.query.sort;
  const count = Number(req.query.count) || 0;

  const sortOption = { createdAt: sort === 'oldest' ? 'asc' : 'desc' };
  const tasks = await Task.find().sort(sortOption).limit(count);

  res.send(tasks);
});

app.get('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: '해당 id를 찾을 수 없습니다.' });
  }
});

app.post('/tasks', async (req, res) => {
  const newTask = await Task.create(req.body);
  res.status(201).send(newTask);
});

app.patch('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = mockTasks.find((task) => task.id === id);

  if (task) {
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    });
    res.send(task);
  } else {
    res.status(404).send({ message: '해당 id를 찾을 수 없습니다.' });
  }
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = mockTasks.findIndex((task) => task.id === id);
  if (idx >= 0) {
    mockTasks.splice(idx, 1);
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: '해당 id를 찾을 수 없습니다.' });
  }
});

app.listen(3000, () => console.log('Server Started'));
