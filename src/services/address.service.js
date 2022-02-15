import AddressModel from '../models/address';

class AddressService {
    add = (data) => {
        return AddressModel.create(data);
    };

    get = (user_id) => {
        return AddressModel.find({ user_id });
    };

    setIsDefault = (user_id) => {
        return AddressModel.updateMany({ user_id }, { $set: { is_default: false } })
    };

    firstAddressDefault = (user_id) => {
        return AddressModel.find({ user_id });
    };

    delete = async (id, user_id) => {
        const address = await AddressModel.findOne({ _id: id });
        console.log('address', address.is_default);
        if (address.is_default) {
            await AddressModel.updateOne({ user_id }, { is_default: true });
        }
        return AddressModel.findByIdAndDelete(id);
    };

    update = (id, data) => {
        return AddressModel.findByIdAndUpdate(id, data, { new: true })
    };

}

export default AddressService;
