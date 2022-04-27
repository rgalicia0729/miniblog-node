const { randomBytes } = require('crypto');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3002;
const commentsByPostId = {};

app.use(cors());
app.use(express.json());

app.get('/posts/:id/comments', (req, res) => {
  const { id } = req.params;

  res.send(commentsByPostId[id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const commentId = randomBytes(4).toString('hex');

  const comments = commentsByPostId[id] || [];
  comments.push({ id: commentId, content });
  commentsByPostId[id] = comments;

  await axios.post('http://localhost:3005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: id
    }
  });

  res.status(201).send(comments);
});

app.post('/events', (req, res) => {
  const { type } = req.body;

  console.log('Received event', type);

  res.send({});
});

app.listen(PORT, () => {
  console.log(`Comment service listening on port ${PORT}`);
});