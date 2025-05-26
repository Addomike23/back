const { product, productCategory } = require("../models/productModel")
const latestProduct = require("../models/latestProduct")
const fs = require("fs");




// products Category Controller
const productCategoryController = async (req, res) => {
    // destruct data from request body
    const { image, name } = req.body

    // validate data
    if (!image || !name) {
        return res.status(401).json({ message: "Please all input field are required" })
    }

    // create category object
    const Category = new productCategory({
        image: image,
        name: name
    })

    // save data in DB
    await Category.save();
    // send response headers
    res.status(201).json({ success: true, message: "Category successfully created" })

    try {

    } catch (error) {
        res.status(401).json({ success: false, message: "Internal error" })
    }
}


// add product controller function

const createProduct = async (req, res) => {
    let image = `${req.file.filename}`
    // get products details from req body
    const { name, description, category, price, stock } = req.body




    // check if all details are intact
    if (!image || !name || !description || !category || !price || !stock) {
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
    if (!image || !name || !description || !category || !price || !stock) {
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

const fetchProducts = async (req, res) => {
    try {
        const {
            category = "",
            search = "",
            sort = "relevancy",
            page = 1,
            limit = 10,
        } = req.query;

        const query = {};

        // --- Filter: Category ---
        if (category) {
            query.category = { $regex: new RegExp(category, "i") }; // Case-insensitive match
        }

        // --- Filter: Search in name or description ---
        if (search) {
            query.$or = [
                { name: { $regex: new RegExp(search, "i") } },
                { description: { $regex: new RegExp(search, "i") } },
            ];
        }

        // --- Sorting Options ---
        let sortOption = {};
        switch (sort) {
            case "price_low":
                sortOption.price = 1;
                break;
            case "price_high":
                sortOption.price = -1;
                break;
            case "newest":
                sortOption.createdAt = -1;
                break;
            case "oldest":
                sortOption.createdAt = 1;
                break;
            case "stock_high":
                sortOption.stock = -1;
                break;
            case "stock_low":
                sortOption.stock = 1;
                break;
            case "relevancy":
            default:
                sortOption = {}; // Default: no explicit sorting
        }

        // --- Pagination ---
        const currentPage = Math.max(parseInt(page), 1);
        const itemsPerPage = Math.max(parseInt(limit), 1);
        const skip = (currentPage - 1) * itemsPerPage;

        // --- Fetch Products and Count ---
        const [products, total] = await Promise.all([
            product.find(query).sort(sortOption).skip(skip).limit(itemsPerPage),
            product.countDocuments(query),
        ]);

        res.status(200).json({
            success: true,
            products,
            page: currentPage,
            limit: itemsPerPage,
            totalResults: total,
            totalPages: Math.ceil(total / itemsPerPage),
        });

    } catch (error) {
        console.error("Fetch products error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// product details

const productDetails = async (req, res) => {
    try {
        const productID = await product.findById(req.params.id);
        if (!productID) return res.status(404).json({ message: "Product not found" });
        res.json(productID);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};




// SINGLE PRODUCT CONTROLLER
const fetchOneProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const singleProduct = await product.findById(id);
        if (!singleProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, product: singleProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// update product

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, category, stock, datePublished } = req.body;
    const image = req.file ? req.file.path : null; // Store image path

    if (!id) {
        return res.status(400).json({ message: 'Product id is required' })
    }

    if (!image || !name || !description || !category || !price || !stock || !datePublished) {
        return res.status(400).json({ message: 'All fields are required' })
    }


    try {
        const updatedProduct = await product.findByIdAndUpdate(id, { image, name, description, category, stock, datePublished }, { new: true });
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
        fs.unlink(`uploads/${deletedProduct.image}`, () => { })

        res.status(200).json({ success: "true", message: 'Product deleted successfully' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// category controller
const CategoryController = async (req, res) => {
    try {
        const name = req.body.name;
        const image = req.file?.filename;

        if (!image || !name) {
            return res.status(400).json({ success: false, message: "All input fields are required" });
        }

        const newCategory = new productCategory({
            image: image,
            category: name
        });

        await newCategory.save();

        res.status(201).json({ success: true, message: "New category added!" });
    } catch (error) {
        console.error("Category upload error:", error);
        res.status(500).json({ success: false, message: "Oops!! An error occurred" });
    }
};

// fetch category controller
const fetchCategoryController = async (req, res) => {
  try {
    const categories = await productCategory.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Fetch categories error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching categories",
    });
  }
};


// exports controllers
module.exports = {
    fetchCategoryController,
    createProduct,
    createLatestProduct,
    fetchProduct,
    fetchProducts,
    updateProduct,
    deleteProduct,
    productDetails,
    fetchLatestProduct,
    CategoryController,
    productCategoryController
}
