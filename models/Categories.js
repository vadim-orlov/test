const {Schema, model} = require('mongoose')


const Categories =  new Schema({
  name: {
    type: String,
    required: true,
  },
  parentId: {
    type:  String,
    required: true,
  }})

  module.exports = model('Categories', Categories)
  
