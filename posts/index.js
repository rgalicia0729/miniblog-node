const { randomBytes } = require('crypto');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;
const posts = {};

app.use(cors());
app.use(express.json());

app.get('/posts', (_, res) => {
  res.send(posts);
});

app.post('/posts', (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id, title
  }

  res.status(201).send(posts[id])
});

app.listen(PORT, () => {
  console.log(`Post service listening on ${PORT}`);
});