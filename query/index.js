const express = require('express');
const cors = require('cors');
const axios = require('axios');

const PORT = 3003;
const posts = {};

const app = express();
app.use(express.json());
app.use(cors());

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    comment.content = content;
  }
}

app.get('/posts', (_, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(PORT, async () => {
  console.log(`Query runing on port ${PORT}`);

  const res = await axios.get('http://event-bus-service:3005/events');

  for (let event of res.data) {
    console.log(`Procesing event ${event.type}`);

    handleEvent(event.type, event.data);
  }
});