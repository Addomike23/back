const express = require("express")
const productRouter = express.Router();
const { createProduct,
    createLatestProduct,
    CategoryController,
    fetchProduct,
    fetchCategoryController,
    fetchProducts,
    productDetails,
    updateProduct,
    deleteProduct,
fetchLatestProduct } = require("../controllers/productController")
const multer = require('multer');


// multer storage
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const categoryStorage = multer.diskStorage({
    destination: "category",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})
// upload middleware
const upload = multer({ storage: storage })
const uploadCategory = multer({ storage: categoryStorage })


// create product router
productRouter.post('/upload', upload.single("image"), createProduct)

// create category
productRouter.post("/category", uploadCategory.single("image"), CategoryController)

// fetch category
productRouter.get("/category", fetchCategoryController)
// latest product
productRouter.post("/upload-latest-product", upload.single("image"), createLatestProduct)

// fetch latest product
productRouter.get("/latest-product", fetchLatestProduct)
// // fetch product router
productRouter.get('/products', fetchProduct)

// // fetch one product
productRouter.get('/filter',fetchProducts)

// // updateProduct 
productRouter.put('/update/:id', updateProduct)

// // delete product
productRouter.delete('/delete/:id', deleteProduct)

// product details route
productRouter.get("/product/:id", productDetails)


module.exports = productRouter;


