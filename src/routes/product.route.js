import express from 'express';
import ProductController from '../controllers/product.controller';
import { addProductValidate } from '../validations/product.validation';
import upload from '../utility/fileUploader';

const productRouter = express.Router();
const productController = new ProductController();

// Add a new product
productRouter.post('/add', upload.array('images'), addProductValidate, productController.add);

// Add a product review
productRouter.post('/review', upload.array('images'), productController.review);

// Get product by id
productRouter.get('/:id', productController.getById);

// Get a products list
productRouter.post('/', productController.get);

// product compare
productRouter.post('/compare', productController.compare)

// Product search
productRouter.post('/search', productController.search)

productRouter.post('/auto-suggest', productController.autoSuggest)

productRouter.put('/view/:seller_id', productController.view)

productRouter.post('/make-bundle', productController.makeBundle)

export default productRouter;
