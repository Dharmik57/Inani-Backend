import express from 'express';
import CategoryController from '../controllers/category.controller';

const categoryRouter = express.Router();
const categoryController = new CategoryController();

// Get all the category
categoryRouter.get('/', categoryController.get);

// Create a new category
categoryRouter.post('/add', categoryController.add);

export default categoryRouter;
