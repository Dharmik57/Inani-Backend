import express from 'express';
import SubCategoryController from '../controllers/subCategory.controller';

const subCategoryRouter = express.Router();
const subCategoryController = new SubCategoryController();

// Get all the sub-category
subCategoryRouter.get('/', subCategoryController.get);

// Create a new sub-category
subCategoryRouter.post('/add', subCategoryController.add);

export default subCategoryRouter;
