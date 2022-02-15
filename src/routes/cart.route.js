import express from 'express';
import CartController from '../controllers/cart.controller';

const cartRouter = express.Router();
const cartController = new CartController();

// Get all cart
cartRouter.get('/', cartController.get);

// Create a new cart
cartRouter.post('/', cartController.add);

// Delete a particular cart
cartRouter.delete("/:product_id", cartController.delete);

// Update a particular cart
cartRouter.put("/:product_id", cartController.update);

export default cartRouter;
