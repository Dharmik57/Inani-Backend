import UserModel from '../models/users';

class AuthService {
    userExist = (email, userName) => {
        return UserModel.find({ $or: [{ email }, { userName }] });
    };

    checkPassword = async (id, password, newPassword) => {
        const user = await UserModel.findById(id)
        if (user.password === password) {
            await this.update(id, { password: newPassword })
            return true
        } else {
            return false
        }
    };

    signup = (data) => {
        return UserModel.create(data);
    };

    updateUserDeviceId = (_id, data) => {
        return UserModel.updateOne({
            _id
        }, data);
    };

    login = (email, password) => {
        return UserModel.findOne({
            $or:
                [
                    {
                        email
                    },
                    {
                        userName: email
                    }
                ],
            password,
            isActive: true,
        });
    };

    update = (id, data) => {
        return UserModel.findByIdAndUpdate(id, data, { new: true });
    };

    forgotPassword = (email) => {
        return UserModel.findOne({
            email,
            isActive: true,
        });
    };

    forgotPasswordChange = (email, password) => {
        return UserModel.update(
            {
                email,
            },
            {
                password,
            },
            { new: true }
        );
    };

    authSocialLogin = async (data) => {
        const { app_device_id, device_type, userName, firstName, lastName, email, socialMediaType, loginID } = data;
        let result = null;
        if (email) {
            result = await UserModel.findOne({
                email,
                isActive: true,
            });
            if (!result) {
                result = await UserModel.create({ ...data, image: 'user-icon.png' });
            } else {
                await UserModel.updateOne({
                    email
                }, {
                    app_device_id,
                    device_type
                });
            }
        }
        return result;
    }
}

export default AuthService;
