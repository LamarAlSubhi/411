require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Travel Journal API');
});

const usersRouter = require('./routes/users');

app.use('/users', usersRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
