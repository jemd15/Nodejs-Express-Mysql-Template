'use strict';

require('dotenv').config();
const express = require('express');
var cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// initializations
const app = express();

// settings
app.set('port', process.env.port || 3000);

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Headers
app.use(cors());

// routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));

// public
app.use('/api/public', express.static(path.join(__dirname, './public')));

// starting the server
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});