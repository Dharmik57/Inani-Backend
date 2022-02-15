import express from 'express';
import PaymentController from '../controllers/payment.controller';

const paymentRouter = express.Router();
const paymentController = new PaymentController();

//Create Order

// checkout payment sheet open
paymentRouter.post('/checkout', paymentController.paymentCheckout);

// get card list from stripe
paymentRouter.get('/cards', paymentController.getSavedPaymentCard);

// saved card only
paymentRouter.post('/add-card', paymentController.addCard);


// Card CRD (Create, Read and Delete card)
// Add new card with users
paymentRouter.post('/new-card', paymentController.addNewCard);

// Add new card with users
paymentRouter.get('/card-list', paymentController.GetCardList);

// Add new card with users
paymentRouter.delete('/card/:card_id', paymentController.RemoveCardWithCustomer);


// Add Bank Details
paymentRouter.post('/new-bank', paymentController.addNewBankDetails);

// Get Bank Details
paymentRouter.get('/banks', paymentController.getBankDetails);

// paymentRouter.post('/save-card', paymentController.saveCardAndGenerateSetupIntent);

// paymentRouter.post('/checkout', paymentController.paymentCheckout);

export default paymentRouter;
