import express from 'express';
import BannerController from '../controllers/banner.controller';
import upload from '../utility/fileUploader';

const bannerRouter = express.Router();
const bannerController = new BannerController();

// Add a new product
bannerRouter.post('/add', upload.single('image'), bannerController.addBanner);

bannerRouter.get('/', bannerController.getBanners)

export default bannerRouter;
