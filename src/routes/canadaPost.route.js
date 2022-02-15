import express from 'express';
import CanadaPostController from '../controllers/canadaPost.controller';

const canadaPostRouter = express.Router();
const canadaPostController = new CanadaPostController();

// Get Delivery charge
canadaPostRouter.post('/charge', canadaPostController.getDeliveryCharge);

export default canadaPostRouter;
