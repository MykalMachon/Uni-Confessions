const express = require('express');
const logger = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const indexRouter = require('./routes/index');
const { Liquid } = require('liquidjs');
const engine = new Liquid();
const flash = require('flash');
const uuidv1 = require('uuid/v1');
const app = express();

// register liquid engine
app.engine('liquid', engine.express());
app.set('views', './views'); // specify the views directory
app.set('view engine', 'liquid'); // set liquid to default

// Show Logs when people connect
app.use(logger('dev'));

// Setup session tracking & cookies
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
      httpOnly: false,
    },
  })
);

// Set up flashes
app.use(flash());

// * RUN ON ANY GET REQUEST
app.get('/*', (req, res, next) => {
  // clear all flashes upon re-render
  req.session.flash = [];
  if (!req.cookies.deviceId) {
    // Set device ID and set cookie age to 1 year
    res.cookie('deviceId', uuidv1(), { maxAge: 1000 * 60 * 60 * 24 * 365 });
  }
  next();
});

// * RUN ON ANY POST REQUEST
app.post('/*', (req, res, next) => {
  // sanitize all data sent over post requests
  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window);
  // for each key-val in the object, loop over and sanitize values
  for (let [key, value] of Object.entries(req.body)) {
    req.body[key] = DOMPurify.sanitize(value);
  }
  next();
});

const { rebuildDatabase } = require('./dbConfig');
rebuildDatabase();

app.use('/', indexRouter);

module.exports = app;
