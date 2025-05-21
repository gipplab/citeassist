const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testAPIRouter = require("./routes/testAPI");
const databaseRouter = require("./routes/database");
const extractRouter = require("./routes/extract");
const latexRouter = require("./routes/latex");
const bodyParser = require('body-parser');
const config = require("./config.json");

const cors = require("cors");

const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// Add raw body handling for plain text
app.use(bodyParser.text({limit: '50mb', type: 'text/plain'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// CORS setup for multiple domains
const corsOptions = {
    origin: JSON.parse(process.env.CORS_URL) || config.cors_url,
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/testAPI", testAPIRouter);
app.use("/database", databaseRouter);
app.use("/extract", extractRouter);
app.use("/latex", latexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
