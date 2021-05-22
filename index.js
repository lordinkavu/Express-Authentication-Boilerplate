const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const dotenv = require('dotenv');
dotenv.config();
const auth = require('./routes/auth');
const User = require('./data/models/User');


(async () => {
    try {
      await mongoose.connect(
        process.env.MONGO_URI,
        { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true }
      );
    } catch (err) {
      console.log("error: " + err);
    }
})();


// app configuration
const app = express();
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(require('express-session')({
    secret:'secret',
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());


// passport configuration
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Routes
app.use('/auth', auth);
app.get('/',(req,res)=>{
    res.sendStatus(200);
})

const port = process.env.PORT || 8000;
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})