const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Category } = require("../models/category");
const multer = require("multer");

// imported from schema
const Product = mongoose.model("Product");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

//get all products
router.get("/products", async (req, resp) => {
  const productList = await Product.find().populate("category");
  if (!productList) {
    resp.status(500).json({ success: false });
  }
  resp.send(productList);
});

//post product
router.post("/products", uploadOptions.single("image"), async (req, resp) => {
  const category = await Category.findById(req.body.category);
  if (!category) return resp.status(400).send("Invalid Category");

  const file = req.file;
  if (!file) return resp.status(400).send("No image in the request");

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    brand: req.body.brand,
    image: `${basePath}${fileName}`,
    images: req.body.images,
    price: req.body.price,
    category: req.body.category,
    rating: req.body.rating,
  });

  product = await product.save();

  if (!product) return resp.status(500).send("The product cannot be created");

  resp.send(product);
});

//get product by ID

router.get("/product/:id", async (req, resp) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    resp
      .status(500)
      .json({ message: "The Product with the given ID was not found." });
  }
  resp.status(200).send(product);
});

// serach product by name and description

router.get("/search/:nameOrDescription", async (req, resp) => {
  const nameOrDescription = req.params.nameOrDescription;

  if (!nameOrDescription) {
    return resp.status(400).json({ error: "Name or description is required" });
  }

  const query = {
    $or: [
      { name: new RegExp(nameOrDescription, "i") },
      { description: new RegExp(nameOrDescription, "i") },
    ],
  };

  try {
    const results = await Product.find(query);
    resp.status(200).json(results);
  } catch (error) {
    console.error("Error searching for products:", error);
    resp.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
