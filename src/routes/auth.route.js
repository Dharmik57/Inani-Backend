import express from 'express';
import AuthController from '../controllers/auth.controller';
import { loginValidate } from '../validations/auth.validation';

const authRouter = express.Router();
const authController = new AuthController();

// Create a new account for users
/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     tags:
 *     - Authentication
 *     description: User can create a new account.
 *     parameters:
 *     - in: body
 *       name: user
 *       description: The user to create.
 *       schema:
 *         type: object
 *         required:
 *            - username
 *            - firstName
 *            - lastName
 *            - password
 *            - email
 *         properties:
 *            username:
 *              type: string
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            password:
 *              type: string
 *            email:
 *              type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: User does not create
 *       500:
 *         description: Internal server error
 */
authRouter.post('/signup', authController.signup);

// User login
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *     - Authentication
 *     description: User login.
 *     parameters:
 *     - in: body
 *       name: user
 *       description: The user can login.
 *       schema:
 *         type: object
 *         required:
 *            - password
 *            - email
 *         properties:
 *            password:
 *              type: string
 *            email:
 *              type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: User does not create
 *       500:
 *         description: Internal server error
 */
authRouter.post('/login', loginValidate, authController.login);

authRouter.put("/:user_id", authController.update);

authRouter.post('/forgot', authController.forgotPassword);

authRouter.post('/resend-mail', authController.resendMail);

authRouter.post('/forgot-password-change', authController.forgotPasswordChange);

authRouter.post('/changePassword', authController.changePassword);

authRouter.post('/social-login', authController.authSocialLogin);

export default authRouter;
