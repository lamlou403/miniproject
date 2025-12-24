const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/miniproject', {  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err)); 
app.use(express.json());
const cors = require('cors');
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
const port = 3000;
const Route=require("./Route");
app.use('/api', Route);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});