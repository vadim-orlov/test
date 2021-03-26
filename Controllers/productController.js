const mongoose = require('mongoose')
const createError = require('http-errors')

const Product = require('../models/Product')


module.exports = {
    getAllProducts :  async (req, res, next) => {
        try { 
     const results =  await Product.find({}, {__v: 0 })
     // const results =  await Product.find({}, { name: 1,price: 1,  _id: 0 })
     // const results =  await Product.find({price: 11}, { })
     res.send(results)
     
        } catch(error) {
         console.log(error.message);
        }
     },

createNewProduct:  async (req, res, next) => {
    
    try {
        const product = new Product(req.body)
        const result = await product.save()
        // res.send(result)
        return res.json({ success: true,message: 'Продукт успешно создан' })
        } catch(error) {
           
            if(error.name === 'ValidationError') {
                next(createError(422, error.message))
                return
            }
            res.status(400).json({success: false, message: 'Ошибка при создании продукта'})
            // next(error)
    }

    // const product = new Product({
    //     name: req.body.name,
    //     price: req.body.price
    // })
    // product.save()
    //     .then(result => {
    //         console.log(result);
    //         res.send(result)

    //     })
    //     .catch(err => {
    //         console.log(err.message);
    //     })
    
},


findProductById: async (req, res, next) => {
    const id = req.params.id
   try {
    const product =  await Product.findById(id)
    // const product =  await Product.findOne({_id: id})
    if(!product) {
        throw createError(404, 'Product does not exist')
    }
    res.send(product)

   } catch(error) {
    console.log(error.message);
    if(error instanceof mongoose.CastError) {
        next(createError(400,'Invalid Product id'))
        return
    }
    next(error)

   }
    
},


updateAproduct: async (req, res, next) => {
    
    try {
        const id = req.params.id
     const updates =  req.body
     const options = { new: true}
      
     const result = await Product.findByIdAndUpdate(id, updates, options)
     if(!result) {
         throw createError(404, 'Product does not exist')
     }
     res.send(result)
 
    } catch(error) {
     console.log(error.message);
     if(error instanceof mongoose.CastError) {
         return next(createError(400, 'Invalid Product id'))
     }
    }
},


deleteAproduct: async (req, res, next) => {
    const id = req.params.id
   try {
    const result =  await Product.findByIdAndDelete(id)
    // const product =  await Product.findOneAndDelete({_id: id})
    console.log(result);
    if(!result) {
        throw createError(404, 'Product does not exist')
    }
    res.send(result)

   } catch(error) {
    console.log(error.message);
    if(error instanceof mongoose.CastError) {
        next(createError(400,'Invalid Product id'))
        return
    }
    next(error)

   }
    
}


    };