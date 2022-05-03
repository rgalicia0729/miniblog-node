const { randomBytes } = require('crypto');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;
const posts = {};

app.use(cors());
app.use(express.json());

app.get('/posts', (_, res) => {
  res.send(posts);
});

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id, title
  }

  await axios.post('http://event-bus-service:3005/events', {
    type: 'PostCreated',
    data: {
      id, title
    }
  });

  res.status(201).send(posts[id])
});

app.post('/events', (req, res) => {
  const { type } = req.body;

  console.log('Received event', type);

  res.send({});
});

app.listen(PORT, () => {
  console.log(`Posts service listening on ${PORT}`);
});