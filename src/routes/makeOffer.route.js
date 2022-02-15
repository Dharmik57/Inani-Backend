import express from 'express';
import MakeOfferController from '../controllers/makeOffer.controller';

const makeOfferRouter = express.Router();
const makeOfferController = new MakeOfferController();

makeOfferRouter.post('/', makeOfferController.add);

makeOfferRouter.post('/seller/:notification_id', makeOfferController.acceptDecline);

export default makeOfferRouter;