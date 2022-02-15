import express from 'express';
import Orders from '../controllers/order.controller';

const orderRouter = express.Router();
const ordersController = new Orders();

//Create Order

orderRouter.post('/checkout', ordersController.checkout)

//Get Orders
orderRouter.post('/', ordersController.get)

//get Transaction List
orderRouter.get('/transactions', ordersController.getTransactions)

//get Order details
orderRouter.get('/:id', ordersController.getById)

// orderRouter.put("/seller-confirmation/:id", ordersController.update);



export default orderRouter;
