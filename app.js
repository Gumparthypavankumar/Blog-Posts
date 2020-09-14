const express = require('express');
const path = require('path');
const _handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const app = express();

//Load Routes
const blogs = require('./routes/blogs');
const users = require('./routes/users');

// Passport config

require('./config/passport')(passport);
//Db Config
const db= require('./config/database');

mongoose.Promise = global.Promise // Map Global Promise - get rid of warning 
//Connect to MongoDb
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

//Handlebars Middleware 
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(_handlebars)
}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

// method-override middleware
app.use(methodOverride('_method'));

// Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash Middleware
app.use(flash());

//Static folder
app.use(express.static(path.join(__dirname,'public')));

//Global Variables
//own middleware next will call the next piece of middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.userstatus = req.user || null;
    next();
});

//Use Routes
app.use('/blogs',blogs);
app.use('/users',users);

app.listen(PORT, () => {
    console.log(`Server Started at port ${PORT}`);
});

//Index Route
app.get('/', (req, res) => {
    res.render('home');
});

// About Route
app.get('/about', (req, res) => {
    res.render('about');
});

