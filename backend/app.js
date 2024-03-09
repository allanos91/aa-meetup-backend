
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { environment } = require('./config');
const isProduction = environment === 'production';
const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }

  // helmet helps set a variety of headers to better secure your app
  app.use(
    helmet.crossOriginResourcePolicy({
      policy: "cross-origin"
    })
  );

  // Set the _csrf token and create req.csrfToken method
  app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
  );


// const eventsRouter = require('./routes/events')
// const groupsRouter = require('./routes/groups')
// const usersRouter = require('./routes/users')
// const venuesRouter = require('./routes/venues')


// app.use('/api/events', eventsRouter);
// app.use('/api/groups', groupsRouter);
// app.use('/api/users', usersRouter);
// app.use('/api/venues', venuesRouter);

const routes = require('./routes');

// ...

app.use(routes);
















module.exports = app;
