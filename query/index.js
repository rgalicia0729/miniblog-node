const express = require('express');
const cors = require('cors');

const PORT = 3003;
const posts = {};

const app = express();
app.use(express.json());
app.use(cors());

app.get('/posts', (_, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId } = data;

    const post = posts[postId];
    post.comments.push({ id, content });
  }

  res.send({});
});

app.listen(PORT, () => {
  console.log(`Query runing on port ${PORT}`);
});