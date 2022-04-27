const express = require('express');
const axios = require('axios');

const PORT = 3005;

const app = express();
app.use(express.json());

app.post('/events', (req, res) => {
  const event = req.body;

  axios.post('http://localhost:3001/events', event);
  axios.post('http://localhost:3002/events', event);
  axios.post('http://localhost:3003/events', event);

  res.send({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Event bus service listening o port ${PORT}`);
});