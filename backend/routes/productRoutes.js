const express = require('express');
const router = express.Router();
const Product = require('../models/producttemp');
const { NotFoundError } = require('../utils/errors');

// Get all products
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
});

// Get single product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
