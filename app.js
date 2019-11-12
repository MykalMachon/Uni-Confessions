const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const sassMiddleware = require('node-sass-middleware');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const { Liquid } = require('liquidjs');
const engine = new Liquid();
const flash = require('flash');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  cookie: { maxAge: 60000 },
  secret: 'comp230',
  resave: false,
  saveUninitialized: false
}));
app.use(cors());
app.use(flash());

app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true,
  })
);
// register liquid engine
app.engine('liquid', engine.express());
app.set('views', './views'); // specify the views directory
app.set('view engine', 'liquid'); // set liquid to default

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
