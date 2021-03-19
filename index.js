const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter')
const PORT = process.env.PORT || 5000
const Role = require('./models/Role')
const cors = require('cors')

const app = express()


app.use(express.json())
app.use('/auth',authRouter)
app.use(cors())

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://qwerty:qwerty123@cluster0.khpbm.mongodb.net/users_login?retryWrites=true&w=majority',  { useNewUrlParser: true , useUnifiedTopology: true } )

        // const user = new Role({value:"USER"})
        // await user.save()
        // console.log(user);

         app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) { 
        console.log(e);
    }
}

start()