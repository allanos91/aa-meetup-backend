// Instantiate Express and the application - DO NOT MODIFY
const express = require('express');
const app = express();

// Import environment variables in order to connect to database - DO NOT MODIFY
require('dotenv').config();

// Express using json - DO NOT MODIFY
app.use(express.json());

const eventsRouter = require('./routes/events')
const groupsRouter = require('./routes/groups')
const usersRouter = require('./routes/users')
const venuesRouter = require('./routes/venues')


app.use('/api/events', eventsRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/users', usersRouter);
app.use('/api/venues', venuesRouter);

















// Set port and listen for incoming requests - DO NOT MODIFY
if (require.main === module) {
    const port = 8000;
    app.listen(port, () => console.log('Server is listening on port', port));
} else {
    module.exports = app;
}
