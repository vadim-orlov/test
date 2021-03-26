const User = require('../models/User')
const Role = require('../models/Role')
const Product = require('../models/Product')
const Categories = require('../models/Categories')
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('../config')


const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles,
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"} )
}


class authController {

    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json ( {success:false, message: "Ошибка при регистрации", errors})
            }

            const {email, password, FIO} = req.body


        

            const candidate = await User.findOne({email})
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