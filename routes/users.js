const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys_dev');
const passport = require('passport');

//Load input validation
const loginValidator = require('../validator/userValidator').loginValidator;
const regValidator = require('../validator/userValidator').registerValidator;

//load the User model
const User = require('../models/User')

//@route users/register
//@desc Register a user
//@access Public
//@Method POST
router.post('/register', (req,res) =>{
    const {errors, isValid} = regValidator(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }else{
       User.findOne({email: req.body.email})
        .then(user =>{
            if(user) {
                errors.email = "Email already exist"
                return res.status(400).json('Email already exists')
            }
            else{
                const {name,email,password,password2} = req.body
                const newUser = new User({
                    name,
                    email,
                    password,
                    password2
                })
                bcrypt.genSalt(10, (err,salt) =>{
                    bcrypt.hash(newUser.password, salt,(err,hash) =>{
                        if(err) throw err;;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
    }
})

//@route users/login
//@desc Login users and return jwt token
//@access public
//@method POST
router.post('/login', (req,res) =>{
    const {errors, isValid} = loginValidator(req.body);
    
    //input validation
    if(!isValid){
        return res.status(400).json(errors);
    }else{
        const {email,password} = req.body
        User.findOne({email})
            .then(user =>{
                if(!user){
                    errors.email = 'Incorrect Password of Email'
                    return res.status(404).json(errors)
                }else{
                    bcrypt.compare(password, user.password)
                        .then(ismatch =>{
                            //matched user
                            if(ismatch){
                                const payload = {id: user.id, name: user.name}
                                jwt.sign(
                                    payload,
                                    keys.secretOrKey,
                                    {expiresIn: 3600},
                                    (err, token) =>{
                                        res.json({
                                            success: true,
                                            token: 'Bearer ' + token
                                        });
                                    }
                                );
                            }else{
                                errors.password = 'Incorrect Password of Email'
                                return res.status(400).json(errors);
                            }
                        });
                }
            })
    }
})


// @route   GET api/users/current
// @desc    Return current user
// @access  Private
// @method GET
router.get('/current', passport.authenticate('jwt', {session: false}), (req,res) =>{
   const {name,id,email} = req.user;
    res.json({
        id,
        name,email
    })
})

module.exports = router;