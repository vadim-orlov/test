const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./Routes/authRouter')
const PORT = process.env.PORT || 5000
const Role = require('./models/Role')
const cors = require('cors')
const productRouter = require('./Routes/productRouter')
const categoriesRouter = require('./Routes/categoriesRouter')
const createError = require('http-errors')
const Recaptcha = require('express-recaptcha').RecaptchaV3;

const app = express()



// recaptcha

















app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/auth',authRouter)
app.use('/products', productRouter)
app.use('/categories', categoriesRouter)

app.use((req, res, next) => {
//    const err = new Error('Not found')
//    err.status = 404
//    next(err)
next(createError(404, "Not found"))
})

//Error handler

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

app.use(cors())

const start = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/MyDb", 
         { useNewUrlParser: true ,
         useUnifiedTopology: true, useFindAndModify:false} )

        // const user = new Role({value:"USER"})
        // await user.save()
        // console.log(user);


         app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) { 
        console.log(e);
    }
}
// Starting the server
start()