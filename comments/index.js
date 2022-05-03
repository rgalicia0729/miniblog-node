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
  comments.push({ id: commentId, content, status: 'pending' });
  commentsByPostId[id] = comments;

  await axios.post('http://event-bus-service:3005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: id,
      status: 'pending'
    }
  });

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { id, content, postId, status } = data;

    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;

    await axios.post('http://event-bus-service:3005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        content,
        postId,
        status
      }
    });
  }

  res.send({});
});

app.listen(PORT, () => {
  console.log(`Comment service listening on port ${PORT}`);
});