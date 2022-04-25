const { randomBytes } = require('crypto');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;
const commentsByPostId = {};

app.use(cors());
app.use(express.json());

app.get('/posts/:id/comments', (req, res) => {
  const { id } = req.params;

  res.send(commentsByPostId[id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const postId = randomBytes(4).toString('hex');

  const comments = commentsByPostId[id] || [];
  comments.push({ id: postId, content });
  commentsByPostId[id] = comments;

  res.status(201).send(comments);
});

app.listen(PORT, () => {
  console.log(`Comment service listening on port ${PORT}`);
});