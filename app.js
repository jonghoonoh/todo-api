import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Task from './models/Task.js';

mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));

const app = express();

const corsOptions = {
  origin: 'http://127.0.0.1:5500',
}

// app.use(cors(corsOptions));
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: e.message });
      } else if (e.name === 'CastError') {
        res.status(404).send({ message: '해당 id를 찾을 수 없습니다.' });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

app.get(
  '/tasks',
  asyncHandler(async (req, res) => {
    /** 쿼리 파라미터
     *  - sort: 'oldest'인 경우 오래된 태스크 기준, 나머지 경우 새로운 태스크 기준
     *  - count: 태스크 개수
     */
    const sort = req.query.sort;
    const count = Number(req.query.count) || 0;

    const sortOption = { createdAt: sort === 'oldest' ? 'asc' : 'desc' };
    const tasks = await Task.find().sort(sortOption).limit(count);

    res.send(tasks);
  })
);

app.get(
  '/tasks/:id',
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
      res.send(task);
    } else {
      res.status(404).send({ message: '해당 id를 찾을 수 없습니다.' });
    }
  })
);

app.post(
  '/tasks',
  asyncHandler(async (req, res) => {
    const newTask = await Task.create(req.body);
    res.status(201).send(newTask);
  })
);

app.patch(
  '/tasks/:id',
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task) {
      Object.keys(req.body).forEach((key) => {
        task[key] = req.body[key];
      });
      await task.save();
      res.send(task);
    } else {
      res.status(404).send({ message: '해당 id를 찾을 수 없습니다.' });
    }
  })
);

app.delete(
  '/tasks/:id',
  asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: '해당 id를 찾을 수 없습니다.' });
    }
  })
);

app.listen(process.env.PORT, () => console.log('Server Started'));
