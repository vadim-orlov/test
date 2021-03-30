const Router = require('express')
const Recaptcha = require('express-recaptcha').RecaptchaV3;
const cors = require('cors')
const router = new Router()
const controller = require('../Controllers/authController')
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')



router.use(cors())

router.get('/start_verification', [check('email', "Имя пользователя не может быть пустым").notEmpty()],  controller.verifyRecaptcha)

router.post('/registration', [ check('email', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({min:4, max:10}),
    check('email').isEmail()
] ,controller.registration)

router.post('/login',  [ check('email', "Имя пользователя не может быть пустым").notEmpty(),
check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({min:4, max:10}),
check('email').isEmail()
],controller.login)

router.get('/users', authMiddleware, controller.getUsers)







module.exports = router
