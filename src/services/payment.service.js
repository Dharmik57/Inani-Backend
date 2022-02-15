import BankDetailsModel from '../models/bankDetails';

class PaymentService {
    add_bank_details = (data) => {
        return BankDetailsModel.create(data);
    };

    get_bank_details = (user_id) => {
        return BankDetailsModel.findOne({
            user_id
        });
    };
}

export default PaymentService;