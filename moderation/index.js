const express = require('express');
const axios = require('axios');

const PORT = 3004;

const app = express();
app.use(express.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    await axios.post('http://localhost:3005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        content: data.content,
        postId: data.postId,
        status
      }
    });
  }

  res.send({});
});

app.listen(PORT, () => {
  console.log(`Moderation service listening on port ${PORT}`);
});