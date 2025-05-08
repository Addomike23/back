const express = require("express")
const productRouter = express.Router();
const { createProduct,
    createLatestProduct,
    fetchProduct,
    fetchOneProduct,
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
// upload middleware
const upload = multer({ storage: storage })

// create product router
productRouter.post('/upload', upload.single("image"), createProduct)

// latest product
productRouter.post("/upload-latest-product", upload.single("image"), createLatestProduct)

// fetch latest product
productRouter.get("/latest-product", fetchLatestProduct)
// // fetch product router
productRouter.get('/products', fetchProduct)

// // fetch one product
productRouter.get('/target/:id', fetchOneProduct)

// // updateProduct 
productRouter.put('/update/:id', updateProduct)

// // delete product
productRouter.delete('/delete/:id', deleteProduct)


module.exports = productRouter;


