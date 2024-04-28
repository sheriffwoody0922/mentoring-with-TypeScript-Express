const express = require('express');
const router = express.Router();

// Import Middleware function to authenticate token From different file
const authenticateToken = require('../middlewares/auth/check-auth');

const getImageExtension = require('../utils/getImageExtension');

const productsController = require('../controllers/products.controller');

// Import multer from node_modules
const multer = require('multer');
// Set Storage Engine
// Configuring and validating the upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  // By default, multer removes file extensions so let's add them back
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${getImageExtension(file.mimetype)}`);
  }
});

// Initialize upload variable
const upload = multer({ storage: storage });

// Handling Get Request to /product
router.get('/', productsController.products_get_all_product);

// Handling Post Request to /product
router.post('/', authenticateToken, upload.single('productImage'), productsController.products_create_product);

// Handling individual Request to /product
router.get('/:productId', authenticateToken, productsController.products_get_one_product);

// Handling updating individual product
router.patch('/:productId', authenticateToken, productsController.products_update_product);

// Handling deleting individual product
router.delete('/:productId', authenticateToken, productsController.products_delete_product);

module.exports = router;
