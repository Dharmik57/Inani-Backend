import express from 'express';
import authenticateToken from '../utility/jwt/middlewareAuthentication';
import authRouter from './auth.route';
import productRouter from './product.route';
import bannerRouter from './banner.route';
import categoryRouter from './category.route';
import subCategoryRouter from './subCategory.route';
import orderRouter from './order.route';
import wishlistRouter from './wishlist.route';
import cartRouter from './cart.route';
import commentRouter from './comment.routes';
import addressRouter from './address.route';
import filterRouter from './filter.route';
import paymentRouter from './payment.route';
import notificationRouter from './notification.route';
import userRouter from './user.route';
import makeOfferRouter from './makeOffer.route'
import canadaPostRouter from './canadaPost.route'
import inaniHubRouter from './inaniHub.route';
import walletRouter from './wallet.route';

var router = express.Router();

router.use('/auth', authRouter);
router.use('/user', authenticateToken, userRouter)
router.use('/product', authenticateToken, productRouter);
router.use('/banner', authenticateToken, bannerRouter);
router.use('/category', authenticateToken, categoryRouter);
router.use('/sub-category', authenticateToken, subCategoryRouter);
router.use('/wishlist', authenticateToken, wishlistRouter);
router.use('/cart', authenticateToken, cartRouter);
router.use('/comment', authenticateToken, commentRouter);
router.use('/order', authenticateToken, orderRouter);
router.use('/address', authenticateToken, addressRouter);
router.use('/filter', authenticateToken, filterRouter);
router.use('/notification', authenticateToken, notificationRouter);
router.use('/make-offer', authenticateToken, makeOfferRouter);
router.use('/wallet', authenticateToken, walletRouter);
router.use('/inani-hub', authenticateToken, inaniHubRouter);
router.use('/payment', paymentRouter);
router.use('/delivery', canadaPostRouter);

export default router;
