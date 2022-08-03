require('dotenv').config()

const express = require('express');
const app = express()
const ejsMate = require('ejs-mate')
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportLocalMoongoose = require('passport-local-mongoose')

const flash = require('connect-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
const User = require('./models/user')
const userRoutes = require('./routes/user');



mongoose.connect(process.env.DB_URL)
    .then(res => {
        console.log('Database connected')
    }).catch(e => console.log(e))

app.engine('ejs', ejsMate)
app.set('views engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))




const sessionConfig = {
    secret: "thissholdbettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        hhtpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})



app.use('/', userRoutes)


app.get('/', (req, res) => {
    res.render('home.ejs')
})



app.listen(3000, () => {
    console.log("listening at 3000")
})