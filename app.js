require('dotenv').config()
const
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	express = require('express'),
	favicon = require('serve-favicon'),
	flash = require('connect-flash'),
	logger = require('morgan'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	path = require('path'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	app = express()

// DEVELOPMENT VARIABLES
process.env.PORT = process.env.PORT || 3000
process.env.NODE_ENV = process.env.NODE_ENV === 'undefined' ? 'development' : process.env.NODE_ENV

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// serve statics
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// setup middleware
app.use(logger('common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// ======passport configuration ===============================================================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', { useMongoClient: true }) // connect to our database

require('./passport/config/passport')(passport) // pass passport for configuration

// required for passport
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
})) // session secret
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash()) // use connect-flash for flash messages stored in session
// ======end passport=========================================================================================

app.use('*', (req, res, next) => {
	if (req.headers['x-forwarded-proto'] !== 'https')
		res.redirect('https://www.mentormap.ca' + req.url)
	else
		next()
})
app.use('/auth', require('./routes/authentication.js'))
app.use('/mentee', require('./routes/mentee.js'))
app.use('/mentor', require('./routes/mentor.js'))
app.use('/', require('./routes/index.js'))



// catch 404 and forward to error handler
app.use((req, res, next) => {
	var err = new Error('Not Found')
	err.status = 404
	next(err)
})

// error handler
app.use((err, req, res, next) => {
	console.log(err)

	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('404')
})

app.listen(process.env.PORT, () => {
	require('./scheduled_job/zoom')
	require('./scheduled_job/session')
	console.log('Server Started')
})
