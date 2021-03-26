const Router = require('express')
const Recaptcha = require('express-recaptcha').RecaptchaV3;
const mongoose = require('mongoose')
const cors = require('cors')
const categoriesRouter = new Router()
const controller = require('../Controllers/categoriesController')
const {check, Result} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const Categories = require('../models/Categories')
const createError = require('http-errors')
const CategoriesController = require('../Controllers/categoriesController')
categoriesRouter.use(cors())






// get a list of all categories
categoriesRouter.get('/', CategoriesController.getAllCategories)

//create a new categories
categoriesRouter.post('/', CategoriesController.createNewCategories)

// get categories by ID
categoriesRouter.get('/:id',CategoriesController.findCategoriesById)

//updating a categories by id
categoriesRouter.put('/:id', CategoriesController.updateAcategories)


// deleting categories by id
categoriesRouter.delete('/:id',CategoriesController.deleteAcategories)


module.exports = categoriesRouter;