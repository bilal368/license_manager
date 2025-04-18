const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const getmac = require('getmac');
const si = require('systeminformation');

const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging MAC Address
getmac.getMac((err, macAddress) => {
  if (err) {
    console.error(err);
  } else {
    console.log('MAC Address:', macAddress);
  }
});

// Routes
const indexRouter = require('./src/routes/index');
const licenseRouter = require('./src/routes/license');
app.use('/api', indexRouter);
app.use('/license',licenseRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).send('Something went wrong!');
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
