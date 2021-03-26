const createError = require('http-errors')
const mongoose = require('mongoose')
const Product = require('../models/Product')
const User = require('../models/User')
const Role = require('../models/Role')
const Categories = require('../models/Categories')
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('../config')


module.exports = {
    getAllCategories :  async (req, res, next) => {
        try { 
     const results =  await Categories.find({}, {__v: 0 })
     res.send(results)
     
        } catch(error) {
         console.log(error.message);
        }
     },



createNewCategories:  async (req, res, next) => {
    
    try {
        const categories = new Categories(req.body)
        const result = await categories.save()


        // res.send(result)
        return res.json({ success: true,message: 'Категория успешно создана' })
        } catch(error) {
            res.status(400).json({success: false, message: 'Ошибка при создании категории'})
            if(error.name === 'ValidationError') {
                next(createError(422, error.message))
                return
            }
            next(error)
    }

    // const categories = new Categories({
    //     name: req.body.name,
    //     parrentId: req.body.parrentId
    // })
    // categories.save()
    //     .then(result => {
    //         console.log(result);
    //         res.send(result)

    //     })
    //     .catch(err => {
    //         console.log(err.message);
    //     })
    
},



findCategoriesById: async (req, res, next) => {
    const id = req.params.id
   try {
    const categories =  await Categories.findById(id)
    // const product =  await Product.findOne({_id: id})
    if(!categories) {
        throw createError(404, 'Categories does not exist')
    }
    res.send(categories)

   } catch(error) {
    console.log(error.message);
    if(error instanceof mongoose.CastError) {
        next(createError(400,'Invalid Categories id'))
        return
    }
    next(error)

   }
    
},


updateAcategories: async (req, res, next) => {
    
    try {
        const id = req.params.id
     const updates =  req.body
     const options = { new: true }
      
     const result = await Categories.findByIdAndUpdate(id, updates, options)
     if(!result) {
         throw createError(404, 'Categories does not exist')
     }
     res.send(result)
 
    } catch(error) {
     console.log(error.message);
     if(error instanceof mongoose.CastError) {
         return next(createError(400, 'Invalid Categories id'))
     }
    }
},


deleteAcategories: async (req, res, next) => {
    const id = req.params.id
   try {
    const result =  await Categories.findByIdAndDelete(id)
    // const product =  await Product.findOneAndDelete({_id: id})
    console.log(result);
    if(!result) {
        throw createError(404, 'Categories does not exist')
    }
    res.send(result)

   } catch(error) {
    console.log(error.message);
    if(error instanceof mongoose.CastError) {
        next(createError(400,'Invalid Categories id'))
        return
    }
    next(error)

   }
    
}


    };