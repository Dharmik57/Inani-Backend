import express from 'express';
import UserController from '../controllers/user.controller';
import upload from '../utility/fileUploader';

const userRouter = express.Router();
const userController = new UserController();

userRouter.get('/', userController.get);

userRouter.put('/profile', upload.single('image'), userController.update);

userRouter.get('/countries', userController.getCountries);

userRouter.get('/state/:country_id', userController.getStates);

userRouter.get('/city/:state_id', userController.getCities);

userRouter.get('/dashboard', userController.getDashboard);

userRouter.get('/profile/:user_id', userController.getProfile);

export default userRouter;
