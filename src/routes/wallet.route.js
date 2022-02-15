import express from 'express';
import WalletController from '../controllers/wallet.controller';

const walletRouter = express.Router();
const walletController = new WalletController();

// Get Wallet amount & transaction
walletRouter.get('/', walletController.getWalletAmount);

// Get wallet balance
walletRouter.get('/balance', walletController.getWalletBalance);

export default walletRouter;
