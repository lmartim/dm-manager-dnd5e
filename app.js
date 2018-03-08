const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const path = require('path')
const ejs = require('ejs')
const mongoose = require('mongoose')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const morgan = require('morgan');
const configDB = require('./config/database.js');

const app = express()

// SETA AS CONFIGURAÇÕES DO EXPRESS
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({ secret: 'tarrasque' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(function (req, res, next) {
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('error');
    next();
});

require('./config/passport')(passport);

// CONECTA AO MONGOOSE
mongoose.connect(configDB.db.uri);

// SETA AS ROTAS
require('./app/routes.js')(app, passport, mongoose, configDB);

app.listen(3000, function () {})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

module.exports = app;