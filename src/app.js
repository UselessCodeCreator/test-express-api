const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const passport = require('passport');

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');

const app = express();

app.use(passport.initialize());

require('./passport/local');
require('./passport/jwt');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());

app.use('/', authRoutes);
app.use('/file', fileRoutes);

module.exports = app;
