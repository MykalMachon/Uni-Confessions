const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');

const indexRouter = require('./routes/index');

const { Liquid } = require('liquidjs');
const engine = new Liquid();
const flash = require('flash');

const app = express();

// register liquid engine
app.engine('liquid', engine.express());
app.set('views', './views'); // specify the views directory
app.set('view engine', 'liquid'); // set liquid to default

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: 'comp230',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cors());
app.use(flash());

// clear all flashes upon re-render
app.get('/*', function (req, res, next) {
  req.session.flash = [];
  next();
});

app.use('/', indexRouter);

module.exports = app;
