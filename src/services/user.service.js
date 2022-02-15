import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import startOfYesterday from 'date-fns/startOfYesterday';
import endOfYesterday from 'date-fns/endOfYesterday';
import UserModel from '../models/users';
import WishlistModel from '../models/wishlists';
import ProductModel from '../models/products';
import CountriesModel from '../models/countries';
import StateModel from '../models/state';
import CitiesModel from '../models/cities';
import OrderModel from '../models/orders';
import ReviewModel from '../models/review';
import { startAndEndOfWeek } from '../utility/helpers';
import { ORDER_STATUS, USER_TYPE } from '../common/constant';

class UserService {
    get = async (id) => {
        const user = await UserModel.findOne({ _id: id });
        const totalWishlist = await WishlistModel.find({ user_id: id }).count();
        const productItem = await ProductModel.find({
            created_by: id,
            qty: {
                $gte: 1
            }
        })
            .populate({
                path: 'category_id',
                select: 'name',
            })
            .sort({ created_date: -1 })
            .populate({
                path: 'sub_cat_id',
                select: 'name',
            });

        const res = {
            totalWishlist,
            totalItems: productItem?.length || 0,
            totalViews: user?.views,
            firstName: user?.firstName,
            lastName: user?.lastName,
            image: user?.image || '',
            email: user?.email,
            productList: productItem || [],
        };

        return res;
    };

    countries = () => {
        return CountriesModel.find({
            country_id: 39
        }).sort({
            name: 'asc'
        });
    };

    states = (id) => {
        return StateModel.find({ country_id: id }).sort({
            name: 'asc'
        });
    };

    cities = (id) => {
        return CitiesModel.find({ state_id: id }).sort({
            name: 'asc'
        });
    };

    update = (id, data) => {
        return UserModel.findByIdAndUpdate(id, data, { new: true });
    };

    getDashboard = async (seller_id) => {
        const today_order = await OrderModel.find({
            ordered_date: {
                $gte: startOfDay(new Date()),
                $lte: endOfDay(new Date()),
            },
            status: {
                $ne: ORDER_STATUS.DECLINED
            },
            seller_id
        });
        const todayAmountArr = today_order.map((x) => parseFloat(x.total_price) - 16.75);
        const todayAmount = todayAmountArr.reduce(
            (partial_sum, a) => parseFloat(partial_sum) + parseFloat(a),
            0
        );
        const todayOrderCount = today_order && today_order.length;

        const yesterday_order = await OrderModel.find({
            ordered_date: {
                $gte: startOfYesterday(),
                $lte: endOfYesterday(),
            },
            status: {
                $ne: ORDER_STATUS.DECLINED
            },
            seller_id
        });
        const yesterdayAmountArr = yesterday_order.map((x) => parseFloat(x.total_price) - 16.75);
        const yesterdayAmount = yesterdayAmountArr.reduce(
            (partial_sum, a) => parseFloat(partial_sum) + parseFloat(a),
            0
        );
        const yesterdayOrderCount = yesterday_order && yesterday_order.length;

        const { monday, sunday } = startAndEndOfWeek();
        const current_week_order = await OrderModel.find({
            ordered_date: {
                $gte: startOfDay(monday),
                $lte: endOfDay(sunday),
            },
            status: {
                $ne: ORDER_STATUS.DECLINED
            },
            seller_id
        });
        const currentWeekAmountArr = current_week_order.map((x) => parseFloat(x.total_price) - 16.75);
        const currentWeekAmount = currentWeekAmountArr.reduce(
            (partial_sum, a) => parseFloat(partial_sum) + parseFloat(a),
            0
        );
        const currentWeekOrderCount = current_week_order.length;

        let date = new Date();
        var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
        lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 1);
        const current_month_order = await OrderModel.find({
            ordered_date: {
                $gte: startOfDay(firstDayOfMonth),
                $lte: endOfDay(lastDayOfMonth),
            },
            status: {
                $ne: ORDER_STATUS.DECLINED
            },
            seller_id
        });
        const currentMonthAmountArr = current_month_order.map((x) => parseFloat(x.total_price) - 16.75);
        const currentMonthAmount = currentMonthAmountArr.reduce(
            (partial_sum, a) => parseFloat(partial_sum) + parseFloat(a),
            0
        );
        const currentMonthOrderCount = current_month_order.length;

        const all_order = await OrderModel.find({
            seller_id,
            status: {
                $ne: ORDER_STATUS.DECLINED
            }
        });
        const allOrderAmountArr = all_order.map((x) => parseFloat(x.total_price) - 16.75);
        const allOrderAmount = allOrderAmountArr.reduce(
            (partial_sum, a) => parseFloat(partial_sum) + parseFloat(a),
            0
        );
        const allOrderCount = all_order.length;

        // declined status order list
        const today_order_declined = await OrderModel.find({
            ordered_date: {
                $gte: startOfDay(new Date()),
                $lte: endOfDay(new Date()),
            },
            seller_id,
            status: ORDER_STATUS.DECLINED,
            declined_by: USER_TYPE.SELLER
        });
        const todayAmountDeclinedArr = today_order_declined.map((x) => parseFloat(x.total_price) - 16.75);
        const todayAmountDeclined = todayAmountDeclinedArr.reduce(
            (partial_sum, a) => parseFloat(partial_sum) + parseFloat(a),
            0
        );
        const todayOrderDeclinedCount = today_order_declined && today_order_declined.length;

        const yesterday_order_declined = await OrderModel.find({
            ordered_date: {
                $gte: startOfYesterday(),
                $lte: endOfYesterday(),
            },
            seller_id,
            status: ORDER_STATUS.DECLINED,
            declined_by: USER_TYPE.SELLER
        });
        const yesterdayAmountArrDeclined = yesterday_order_declined.map((x) => parseFloat(x.total_price) - 16.75);
        const yesterdayAmountDeclined = yesterdayAmountArrDeclined.reduce(
            (partial_sum, a) => parseFloat(partial_sum) + parseFloat(a),
            0
        );
        const yesterdayOrderCountDeclined = yesterday_order_declined && yesterday_order_declined.length;

        const current_week_order_declined = await OrderModel.find({
            ordered_date: {
                $gte: startOfDay(monday),
                $lte: endOfDay(sunday),
            },
            seller_id,
            status: ORDER_STATUS.DECLINED,
            declined_by: USER_TYPE.SELLER
        });
        const currentWeekAmountArrDeclined = current_week_order_declined.map((x) => parseFloat(x.total_price) - 16.75);
        const currentWeekAmountDeclined = currentWeekAmountArrDeclined.reduce(
            (partial_sum, a) => parseFloat(partial_sum) + parseFloat(a),
            0
        );
        const currentWeekOrderCountDeclined = current_week_order_declined.length;

        const current_month_order_declined = await OrderModel.find({
            ordered_date: {
                $gte: startOfDay(firstDayOfMonth),
                $lte: endOfDay(lastDayOfMonth),
            },
            seller_id,
            status: ORDER_STATUS.DECLINED,
            declined_by: USER_TYPE.SELLER
        });
        const currentMonthAmountArrDeclined = current_month_order_declined.map((x) => parseFloat(x.total_price) - 16.75);
        const currentMonthAmountDeclined = currentMonthAmountArrDeclined.reduce(
            (partial_sum, a) => parseFloat(partial_sum) + parseFloat(a),
            0
        );
        const currentMonthOrderCountDeclined = current_month_order_declined.length;

        const all_order_declined = await OrderModel.find({
            seller_id,
            status: ORDER_STATUS.DECLINED,
            declined_by: USER_TYPE.SELLER
        });
        const allOrderAmountArrDeclined = all_order_declined.map((x) => parseFloat(x.total_price) - 16.75);
        const allOrderAmountDeclined = allOrderAmountArrDeclined.reduce(
            (partial_sum, a) => parseFloat(partial_sum) + parseFloat(a),
            0
        );
        const allOrderCountDeclined = all_order_declined.length;

        const reviews = await ReviewModel.find({
            seller_id,
        }).populate({
            path: 'user_id',
            select: ['firstName', 'lastName', 'userName', 'image'],
        })

        return {
            dashboard: {
                today: {
                    count: todayOrderCount,
                    amount: todayAmount
                },
                yesterday: {
                    count: yesterdayOrderCount,
                    amount: yesterdayAmount
                },
                week: {
                    count: currentWeekOrderCount,
                    amount: currentWeekAmount
                },
                month: {
                    count: currentMonthOrderCount,
                    amount: currentMonthAmount
                },
                all_time: {
                    count: allOrderCount,
                    amount: allOrderAmount
                }
            },
            declined: {
                today: {
                    count: todayOrderDeclinedCount,
                    amount: todayAmountDeclined
                },
                yesterday: {
                    count: yesterdayOrderCountDeclined,
                    amount: yesterdayAmountDeclined
                },
                week: {
                    count: currentWeekOrderCountDeclined,
                    amount: currentWeekAmountDeclined
                },
                month: {
                    count: currentMonthOrderCountDeclined,
                    amount: currentMonthAmountDeclined
                },
                all_time: {
                    count: allOrderCountDeclined,
                    amount: allOrderAmountDeclined
                }
            },
            reviews
        };
    };
}

export default UserService;
