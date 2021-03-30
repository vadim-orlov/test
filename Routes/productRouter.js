const Router = require('express')
const cors = require('cors')
const productRouter = new Router()
const ProductController = require('../Controllers/productController')
productRouter.use(cors())



// get a list of all products
productRouter.get('/', ProductController.getAllProducts)

//create a new product
productRouter.post('/',ProductController.createNewProduct)

// get product by ID
productRouter.get('/:id', ProductController.findProductById)

//updating a product by id
productRouter.put('/:id',ProductController.updateAproduct)


// deleting product by id
productRouter.delete('/:id',ProductController.deleteAproduct)


module.exports = productRouter