import express from 'express';
import FilterController from '../controllers/filter.controller';

const filterRouter = express.Router();
const filterController = new FilterController();

// Get filter product
filterRouter.get('/', filterController.get);

// Get filter product
filterRouter.get('/brands', filterController.getBrands);

export default filterRouter;
