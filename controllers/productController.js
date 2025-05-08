const product = require("../models/productModel")
const latestProduct = require("../models/latestProduct")
const fs = require("fs");



// add product controller function



const createProduct = async (req, res) => {
    let image = `${req.file.filename}`
    // get products details from req body
    const { name, description, category, price, stock } = req.body
    
    
    

    // check if all details are intact
    if ( !image || !name || !description || !category || !price || !stock) {
        return res.status(400).json({ message: 'All fields are required' })

    }

    // create book and save it in database
    const newProduct = new product({
        image,
        name,
        description,
        category,
        price,
        stock,
        datePublished: Date.now().toString()
    })

    try {
        
        // save new product
        await newProduct.save();
        res.status(201).json({ sucess: "true", message: 'new product created successfully', newProduct })

    } catch (error) {
        res.status(500).json({ sucess: "false", message: "internal error" })
    }
}

// add latest product controller
const createLatestProduct = async (req, res) => {
    let image = `${req.file.filename}`
    // get products details from req body
    const { name, description, category, price, stock } = req.body
    
    
    

    // check if all details are intact
    if ( !image || !name || !description || !category || !price || !stock) {
        return res.status(400).json({ message: 'All fields are required' })

    }

    // create book and save it in database
    const newProduct = new latestProduct({
        image,
        name,
        description,
        category,
        price,
        stock,
        datePublished: Date.now().toString()
    })

    try {
        
        // save new product
        await newProduct.save();
        res.status(201).json({ sucess: "true", message: 'new product created successfully', newProduct })

    } catch (error) {
        res.status(500).json({ sucess: "false", message: "internal error" })
    }
}

// fetch all products function
const fetchProduct = async (req, res) => {
    try {
        const products = await product.find({}); // Await the query

        if (!products || products.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found' });
        }

        res.status(200).json({
            success: true,
            products: products
          });

    } catch (error) {
        console.error("Error fetching products:", error); // Log the error for debugging
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// fecth lastest product
const fetchLatestProduct = async (req, res) => {
    try {
        const products = await latestProduct.find({}); // Await the query

        if (!products || products.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found' });
        }

        res.status(200).json({
            success: true,
            products: products
          });

    } catch (error) {
        console.error("Error fetching products:", error); // Log the error for debugging
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// fetch one product

const fetchOneProduct = async (req, res) => {
    const { id } = req.params;

    try {
        // Validate ID format
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }

        const targetProduct = await product.findById(id); // Ensure 'Product' is correctly imported

        if (!targetProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, message: 'Product found', product: targetProduct });

    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// update product

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const {name, description, category, stock, datePublished } = req.body;
    const image = req.file ? req.file.path : null; // Store image path

    if (!id) {
        return res.status(400).json({ message: 'Product id is required' })
    }

    if (!image || !name || !description || !category || !price || !stock || !datePublished) {
        return res.status(400).json({ message: 'All fields are required' })
    }


    try {
        const updatedProduct = await product.findByIdAndUpdate(id, {image, name, description, category, stock, datePublished }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.status(200).json({ message: 'Product updated successfully', book })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }
}


// delete a book
const deleteProduct = async (req, res) => {
    const { id } = req.params; // Get the ID from the request body

    if (!id) {
        return res.status(400).json({ message: 'Product id is required' })
    }

    try {
        const deletedProduct = await product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' })
        }
        // delete image from uploads folder
        fs.unlink(`uploads/${deletedProduct.image}`, ()=>{})
        
        res.status(200).json({success: "true", message: 'Product deleted successfully'})

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }
}


// exports controllers
module.exports = {
    createProduct,
    createLatestProduct,
    fetchProduct,
    fetchOneProduct,
    updateProduct,
    deleteProduct,
   fetchLatestProduct
}
