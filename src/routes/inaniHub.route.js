import express from 'express';
import InaniHubController from '../controllers/inaniHub.controller';

const inaniHubRouter = express.Router();
const inaniHubController = new InaniHubController();

// Order amount release by Inani Hub Team
inaniHubRouter.post('/payment-release', inaniHubController.paymentRelease);

// // Create a new address
// inaniHubRouter.post('/', addressController.add);

// // Delete a particular address
// inaniHubRouter.delete("/:address_id", addressController.delete);

// // Update a particular address
// inaniHubRouter.put("/:address_id", addressController.update);

export default inaniHubRouter;
