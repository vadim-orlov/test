const {Schema, model} = require('mongoose')


const Product =  new Schema({
  name: {
    type: String,
    required: true,
  }, 
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  user: [{ type:String , ref: 'User',required: true}],
  category: [{ type: String, ref: 'Categories',required: true}]
},{
  timestamps: true
})

  module.exports = model('Product', Product)












 