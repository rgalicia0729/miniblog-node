const express = require('express');
const axios = require('axios');

const PORT = 3005;
const events = [];

const app = express();
app.use(express.json());

app.get('/events', (_, res) => {
  res.send(events);
});

app.post('/events', (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post('http://posts-service:3001/events', event).catch(err => console.error(err.message));
  axios.post('http://comments-service:3002/events', event).catch(err => console.error(err.message));
  axios.post('http://query-service:3003/events', event).catch(err => console.error(err.message));
  axios.post('http://moderation-service:3004/events', event).catch(err => console.error(err.message));

  res.send({ status: 'OK' });
});


app.listen(PORT, () => {
  console.log(`Event bus service listening o port ${PORT}`);
});