import express from 'express';
import AddressController from '../controllers/address.controller';

const addressRouter = express.Router();
const addressController = new AddressController();

// Get all address
addressRouter.get('/', addressController.get);

// Get all address
addressRouter.get('/exist', addressController.existAddress);

// Create a new address
addressRouter.post('/', addressController.add);

// Delete a particular address
addressRouter.delete("/:address_id", addressController.delete);

// Update a particular address
addressRouter.put("/:address_id", addressController.update);

export default addressRouter;
