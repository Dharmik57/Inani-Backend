import Stripe from 'stripe';
import { HTTP_STATUS } from '../common/constant';
import PaymentService from '../services/payment.service';
import { response } from '../utility/helpers';
import stripConfig from '../config/strip.config';
import tokenInfo from '../utility/jwt/tokenInfo';
import UserModel from '../models/users';

class PaymentController {
    constructor() {
        this.paymentService = new PaymentService();
        this.stripe = new Stripe(stripConfig.SECRET);
    }

    userExistOnStrip = async (user_id) => {
        const userData = await UserModel.findOne({
            _id: user_id,
        });

        var customerId = '';
        if (!userData.strip_customer_id) {
            const customer = await this.stripe.customers.create({
                email: userData.email ?? '',
                name: userData ? `${userData.firstName} ${userData.lastName}` : '',
            });
            customerId = customer.id;
            await UserModel.findByIdAndUpdate(
                user_id,
                { strip_customer_id: customer.id },
                { new: true }
            );
        } else {
            customerId = userData.strip_customer_id;
        }
        return customerId;
    };

    // direct checkout flow
    paymentCheckout = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const { amount, currency, order_id } = req.body;

            const customerId = await this.userExistOnStrip(user.id);
            const ephemeralKey = await this.stripe.ephemeralKeys.create(
                { customer: customerId },
                { apiVersion: '2020-08-27' }
            );

            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amount * 100,
                currency,
                customer: customerId,
                setup_future_usage: 'on_session',
                payment_method_types: ['card'],
                metadata: {
                    order_id, //here pass the order id will use in future
                },
            });

            const result = {
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customerId,
                publishableKey: stripConfig.PUBLISHABLE,
            };
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'filter_get', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'filter_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    getSavedPaymentCard = async (req, res) => {
        try {
            const user = tokenInfo(req, res);

            const userData = await UserModel.findOne({
                _id: user.id,
            });

            if (userData.strip_customer_id) {
                const paymentMethods = await this.stripe.paymentMethods.list({
                    customer: userData.strip_customer_id,
                    type: 'card',
                });
                response(res, HTTP_STATUS.SUCCESS, 'filter_get', paymentMethods.data);
                return;
            }
            response(res, HTTP_STATUS.SUCCESS, 'not_found_saved_card', { data: [] });
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    // save card for future
    addCard = async (req, res) => {
        try {
            const stripe = new Stripe(stripConfig.SECRET);
            const user = tokenInfo(req, res);

            const userData = await UserModel.findOne({
                _id: user.id,
            });

            const setupIntent = await stripe.setupIntents.create({
                customer: userData.strip_customer_id || 'cus_KqstivxPuqdn4F',
            });
            const clientSecret = setupIntent.client_secret;

            if (clientSecret) {
                response(res, HTTP_STATUS.SUCCESS, 'filter_get', { clientSecret });
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'filter_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    //CRUD for cards
    addNewCard = async (req, res) => {
        try {
            const stripe = new Stripe(stripConfig.SECRET);
            const user = tokenInfo(req, res);
            const { card_number, exp_month, exp_year, cvc, card_holder_name } = req.body;

            const customerId = await this.userExistOnStrip(user.id);

            const paymentMethodCreate = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                    number: card_number,
                    exp_month,
                    exp_year,
                    cvc,
                },
                billing_details: {
                    name: card_holder_name,
                },
            });

            const paymentMethod = await stripe.paymentMethods.attach(paymentMethodCreate.id, {
                customer: customerId,
            });

            if (paymentMethod) {
                response(res, HTTP_STATUS.SUCCESS, 'new_card_added', paymentMethod);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'new_card_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    GetCardList = async (req, res) => {
        try {
            const stripe = new Stripe(stripConfig.SECRET);
            const user = tokenInfo(req, res);

            const customerId = await this.userExistOnStrip(user.id);

            const paymentMethod = await stripe.paymentMethods.list({
                customer: customerId,
                type: 'card',
            });

            if (paymentMethod) {
                response(res, HTTP_STATUS.SUCCESS, 'card_list', paymentMethod.data);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'get_card_list_issue');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    RemoveCardWithCustomer = async (req, res) => {
        try {
            const stripe = new Stripe(stripConfig.SECRET);
            const payment_id = req.params.card_id;

            const paymentMethod = await stripe.paymentMethods.detach(payment_id);

            if (paymentMethod) {
                response(res, HTTP_STATUS.SUCCESS, 'removed_card_from_customer', paymentMethod.data);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'get_card_list_issue');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    addBankDetails = async (req, res) => {
        try {
            const stripe = new Stripe(stripConfig.SECRET);
            const user = tokenInfo(req, res);

            const customerId = await this.userExistOnStrip(user.id);

            const bankAccount = await stripe.customers.createSource(customerId, {
                source: {
                    account_holder_name: 'Yash Sonani',
                    account_holder_type: 'individual',
                    routing_number: '',
                    account_number,
                },
            });

            const paymentMethodCreate = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                    number: '4242424242424242',
                    exp_month: 1,
                    exp_year: 2023,
                    cvc: '314',
                },
                billing_details: {
                    name: 'Yash Patel',
                    email: 'yash.sonani@servofeat.com',
                },
            });

            const paymentMethod = await stripe.paymentMethods.attach(paymentMethodCreate.id, {
                customer: customerId,
            });

            if (paymentMethod) {
                response(res, HTTP_STATUS.SUCCESS, 'filter_get', paymentMethod);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'filter_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    // Add new Bank Details
    addNewBankDetails = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const { account_holder_name, insitution_code, transit_code, account_number } = req.body;
            const request = {
                account_holder_name,
                insitution_code,
                account_number,
                transit_code,
                user_id: user.id,
            }

            const bankAccount = await this.paymentService.add_bank_details(request);

            if (bankAccount) {
                response(res, HTTP_STATUS.SUCCESS, 'new_bank_added', bankAccount);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'new_bank_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    }

    getBankDetails = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const bankAccount = await this.paymentService.get_bank_details(user.id);
            response(res, HTTP_STATUS.SUCCESS, 'new_bank_get', bankAccount);
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    }

    // saveCardAndGenerateSetupIntent = async (req, res) => {
    //     try {
    //         // const stripe = new Stripe(stripConfig.SECRET);
    //         const user = tokenInfo(req, res);

    //         const userData = await UserModel.findOne({
    //             _id: user.id,
    //         });

    //         console.log('userData', userData);

    //         var customerId = '';
    //         if (!userData.strip_customer_id) {
    //             const customer = await this.stripe.customers.create({
    //                 email: userData.email ?? '',
    //                 name: userData ? `${userData.firstName} ${userData.lastName}` : '',
    //             });
    //             console.log('customer', customer);
    //             customerId = customer.id;
    //             await UserModel.findByIdAndUpdate(
    //                 user.id,
    //                 { strip_customer_id: customer.id },
    //                 { new: true }
    //             );
    //         } else {
    //             customerId = userData.strip_customer_id;
    //         }

    //         const ephemeralKey = await this.stripe.ephemeralKeys.create(
    //             { customer: customerId },
    //             { apiVersion: '2020-08-27' }
    //         );

    //         const setupIntent = await this.stripe.setupIntents.create({
    //             customer: customerId,
    //         });

    //         // const paymentIntent = await stripe.paymentIntents.create({
    //         //     amount: 100,
    //         //     currency: 'inr',
    //         //     customer: customerId,
    //         //     setup_future_usage: 'off_session',
    //         //     payment_method_types: ['card'],
    //         // });

    //         const result = {
    //             // paymentIntent: paymentIntent.client_secret,
    //             ephemeralKey: ephemeralKey.secret,
    //             customer: customerId,
    //             publishableKey: stripConfig.PUBLISHABLE,
    //             setupIntent: setupIntent.client_secret,
    //         };
    //         if (result) {
    //             response(res, HTTP_STATUS.SUCCESS, 'filter_get', result);
    //         }
    //         response(res, HTTP_STATUS.BAD_REQUEST, 'filter_bad_request');
    //     } catch (err) {
    //         console.log('err', err);
    //         response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
    //     }
    // };

    // paymentCheckout = async (req, res) => {
    //     try {
    //         const { paymentMethodId } = req.body;
    //         const user = tokenInfo(req, res);

    //         const userData = await UserModel.findOne({
    //             _id: user.id,
    //         });

    //         const paymentIntent = await this.stripe.paymentIntents.create({
    //             amount: 50,
    //             currency: 'inr',
    //             customer: userData.strip_customer_id,
    //             payment_method: paymentMethodId,
    //             off_session: true,
    //             confirm: true,
    //         });

    //         const ephemeralKey = await this.stripe.ephemeralKeys.create(
    //             { customer: userData.strip_customer_id },
    //             { apiVersion: '2020-08-27' }
    //         );

    //         const result = {
    //             paymentIntent: paymentIntent.client_secret,
    //             customer: userData.strip_customer_id,
    //             ephemeralKey: ephemeralKey.secret,
    //             publishableKey: stripConfig.PUBLISHABLE,
    //         };
    //         if (result) {
    //             response(res, HTTP_STATUS.SUCCESS, 'filter_get', result);
    //         }
    //         response(res, HTTP_STATUS.BAD_REQUEST, 'filter_bad_request');
    //     } catch (err) {
    //         console.log('err', err);
    //         response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
    //     }
    // };
}

export default PaymentController;
