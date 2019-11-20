const express = require('express');
const logger = require('morgan');
// const cors = require('cors');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

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
app.use(cookieParser());
app.use(
  session({
    name: 'sid',
    secret: 'comp230',
    resave: false,
    httpOnly: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 15,
      secure: false,
      path: '/',
      httpOnly: false
    },
  })
);
// app.use(cors());
app.use(flash());

// clear all flashes upon re-render
app.get('/*', (req, res, next) => {
  req.session.flash = [];

  next();
});

// sanitize all data sent over post requests
app.post('/*', (req, res, next) => {
  const window = (new JSDOM('')).window;
  const DOMPurify = createDOMPurify(window);
  // for each key-val in the object, loop over and sanitize values
  for (let [key, value] of Object.entries(req.body)) {
    req.body[key] = DOMPurify.sanitize(value);
  }
  next();
})

app.use('/', indexRouter);

module.exports = app;
