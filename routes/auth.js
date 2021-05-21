const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require("../data/models/User")

//Signup routes
router.get('/signup',(req,res)=>{
    res.render('user/signup')
})

router.post('/signup',(req,res)=>{
    User.register(
        new User({
            email:req.body.email
        }),
        req.body.password,
        (err,user) =>{
            if(err){
                console.log(err);
                res.redirect('/signup');
            }
            passport.authenticate('local')(req,res,()=>{
                res.sendStatus(200);
            })
        }

    )
})

//Login routes
router.get('/login',(req,res)=>{
    res.render('user/login');
})

router.post('/login', passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/login'
}),(req,res) =>{});

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
})



module.exports = router;