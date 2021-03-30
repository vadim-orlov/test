const User = require('../models/User')
const Role = require('../models/Role')
const Product = require('../models/Product')
const Categories = require('../models/Categories')
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('../config')
const Captcha = require('node-captcha-generator');
require('dotenv').config()

var storage={};


const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles,
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"} )
}


class authController {

    async verifyRecaptcha(req, res) {
        try {
            const {email} = req.query;
           
            const candidate = await User.findOne({email});
            if(candidate) {
                return res.status(400).json({success:false, message: 'Пользователь с таким именем уже существует'})
            }

            if ( storage[email] && (new Date().getTime()- new Date(storage[email].time).getTime())/60000 < proccess.env.RECAPTCHA_EXPIRE_TIME ) {
                return res.status(400).json ( {success:false, message: "You requested too frequently"})
            }

            var c = new Captcha({
                length:5, // Captcha length
                size:{    // output size
                    width: 100,
                    height: 40
                }
            });


            if ( storage[email] ) {
               delete storage[email];
            }

            console.log(c.value);
            
            storage[email] = {
                code: c.value,
                time: new Date(),
                attempt:0
            }

           

            c.toBase64(function(err, base64){
                let base64Data  =   base64.replace(/^data:image\/png;base64,/, "");
                base64Data  +=  base64Data.replace('+', ' ');
               
                let binaryData  =   new Buffer.from(base64Data, 'base64').toString('binary');
                    if(err){
                        console.log("Captcha Error");
                        console.log(err);
                    }
                    else{
                        res.contentType('image/png');
                        res.end(binaryData,'binary');
                    }
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({success: false, message: 'Registration error'})
        }
    }


    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json ( {success:false, message: "Ошибка при регистрации"})
            }
            const {email, password, FIO, code} = req.body;

         
            if ( !storage[email] ) {
                return res.status(400).json ( {success:false, message: "First go through start verification"})
            }

            if (storage[email].attempt > 2 ) {
                return res.status(400).json ( {success:false, message: "You attempted more than 3 times"})
            }
            
            if (parseInt(storage[email].code) !== parseInt(code) ) {
                storage[email].attempt= storage[email].attempt + 1;
                return res.status(400).json ( {success:false, message: "Recaptcha code is invalid"})
            }

            if ( (new Date().getTime()- new Date(storage[email].time).getTime())/60000 > proccess.env.RECAPTCHA_EXPIRE_TIME) {
                storage[email].attempt= storage[email].attempt + 1;
                return res.status(400).json ( {success:false, message: "Recaptcha code is expired"})
            }
            
            delete storage[email];

            const candidate = await User.findOne({email});
            if(candidate) {
                return res.status(400).json({success:false, message: 'Пользователь с таким именем уже существует'})
            }


            const hashPassword = bcrypt.hashSync(password, 7);

            const userRole = await Role.findOne({value: "USER"})
            const user = new User({FIO, email, password:hashPassword, roles: [userRole.value]})
            await user.save()
            const token = generateAccessToken(user._id, user.roles)
            return res.json({ success: true, token,message: 'Пользователь успешно зарегистрирован' })
    
        } catch(e) {
            console.log(e)
            res.status(400).json({success: false, message: 'Registration error'})
        }  
    }




    async login(req, res) {
          try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if(!user) {
                return res.status(400).json({ success:false, message: `Пользователь ${email} не найден`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({success:false, message: `Введен неверный пароль`})
            }

            const token = generateAccessToken(user._id, user.roles)
            return res.json({ success: true, token})
        } catch(e) {
            console.log(e)
            res.status(400).json({success:false, message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
           const users = await User.find(null, {"_id":true, "email":true, "FIO":true, "roles":true})
             res.json(users)
        } catch(e) {
            console.log(e)
        }
    }

}






module.exports = new authController();