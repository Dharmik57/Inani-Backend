import { HTTP_STATUS, PRODUCT_FILTER_SORT } from '../common/constant';
import ProductService from '../services/product.service';
import WishlistService from '../services/wishlist.service';
import MakeOfferService from '../services/makeOffer.service';
import { response } from '../utility/helpers';
import tokenInfo from '../utility/jwt/tokenInfo';

class ProductController {
    constructor() {
        this.productService = new ProductService();
        this.wishlistService = new WishlistService();
        this.makeOfferService = new MakeOfferService();
    }

    // Add products
    add = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const fileRecievedFromClient = req.files;
            const request = req.body;
            request.images = fileRecievedFromClient.map((x) => x.key);
            request.created_by = user.id;

            const result = await this.productService.add(request);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'product_uploaded', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'product_not_uploaded');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    makeBundle = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const request = req.body;
            request.created_by = user.id;

            const result = await this.productService.makeBundle(request);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'product_uploaded', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'product_not_uploaded');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    // Add review
    review = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const fileRecievedFromClient = req.files;
            const request = req.body;
            request.images = fileRecievedFromClient.map((x) => x.key);
            request.user_id = user.id;

            const isExist = await this.productService.isProductReviewExist(user.id, request.product_id);

            if (isExist && isExist.length === 0) {
                const product_detail = await this.productService.getProductDetails(request.product_id);
                request.seller_id = product_detail.created_by;

                const result = await this.productService.add_review(request);
                if (result) {
                    response(res, HTTP_STATUS.SUCCESS, 'product_review_uploaded', result);
                    return;
                }
                response(res, HTTP_STATUS.BAD_REQUEST, 'product_review_not_uploaded');
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'product_review_already_exist');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    // Get product by Id
    getById = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const _condition = {
                _id: req.params.id,
            };

            const product = await this.productService.getById(_condition);
            var reviews = await this.productService.getAllTheReview(product._id);
            const comments = await this.productService.getAllComment(product._id);

            const searchProduct = await this.wishlistService.getByFilter({
                user_id: user.id,
                product_id: product._id,
            });
            const makeOffer = await this.makeOfferService.filter({
                customer_id: user.id,
                is_offer_active: true,
                product_id: product._id,
            });

            if (product) {
                response(res, HTTP_STATUS.SUCCESS, 'product_get', {
                    ...product._doc,
                    reviews,
                    comments,
                    wishlist: searchProduct && searchProduct.length > 0 ? true : false,
                    make_offer: makeOffer && makeOffer.length > 0 ? true : false,
                    discount_price: makeOffer && makeOffer.length > 0 ? makeOffer[0].price : product._doc.discount_price,
                });
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'product_bad_request');
            return;
        } catch (error) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    // Get products list
    get = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const { category_id, sub_cat_id, skip, pageLimit, product_id } = req.body;
            const _condition = {
                is_active: true,
                created_by: {
                    $ne: user.id
                },
                qty: {
                    $gte: 1
                }
            };

            if (category_id && category_id !== '') {
                _condition.category_id = category_id;
            }

            if (sub_cat_id && sub_cat_id !== '') {
                _condition.sub_cat_id = sub_cat_id;
            }

            var product = await this.productService.get(_condition, pageLimit, skip);

            const searchProduct = await this.wishlistService.getByFilter({ user_id: user.id });
            const productIds = searchProduct.map((data) => data.product_id?.toString());
            const makeOffer = await this.makeOfferService.filter({
                customer_id: user.id,
                is_offer_active: true,
            });
            // const makeOfferIds = makeOffer.map((data) => data.product_id?.toString());
            // const filterProduct = product?.productList?.filter(data => makeOfferIds.includes(data?._id?.toString()))

            const newProduct =
                product?.length > 0
                    ? product?.map((pro) => {
                        const data = makeOffer?.filter(
                            (data) =>
                                data?.product_id?.toString() === pro._id?.toString() &&
                                data?.price
                        );

                        if (data?.length > 0) {
                            pro.discount_price = data[0].price;
                            pro.make_offer = true;
                        } else {
                            pro.make_offer = false;
                        }

                        if (productIds && productIds.includes(pro && pro._id?.toString())) {
                            pro.wishlist = true;
                            return pro;
                        } else {
                            pro.wishlist = false;
                            return pro;
                        }
                    })
                    : [];

            if (product) {
                response(res, HTTP_STATUS.SUCCESS, 'product_get', newProduct);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'product_bad_request');
            return;
        } catch (error) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    compare = async (req, res) => {
        try {
            var product = await this.productService.compare(req.body.product_id);
            if (product) {
                response(res, HTTP_STATUS.SUCCESS, 'product_compare', product);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'product_bad_request');
            return;
        } catch (error) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    search = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const { search, brand, size, condition, price, sortBy, pageLimit, skip } = req?.body;
            const filter = {
                $or: [
                    { description: { $regex: search, $options: 'i' } },
                    { name: { $regex: search, $options: 'i' } },
                ],
                created_by: {
                    $ne: user.id
                },
                qty: {
                    $gte: 1
                }
            };

            if (brand?.length > 0) {
                filter.brand = { $in: brand };
            }

            if (size?.length > 0) {
                filter.size = { $in: size };
            }

            if (condition?.length > 0) {
                filter.condition = { $in: condition };
            }

            if (price && price?.min && price?.max) {
                filter.price = {
                    $gte: price && (price.min || 0),
                    $lte: price && (price.max || 9999999),
                };
            } else if (price && price.min) {
                filter.price = { $gte: price && (price.min || 0) };
            } else if (price && price.max) {
                filter.price = { $lte: price && (price.max || 9999999) };
            }

            let sort;
            if (sortBy === PRODUCT_FILTER_SORT.PRICE_LOW_TO_HIGH) {
                sort = { price: 1 };
            } else if (sortBy === PRODUCT_FILTER_SORT.PRICE_HIGH_TO_LOW) {
                sort = { price: -1 };
            } else if (sortBy === PRODUCT_FILTER_SORT.DATE_PUBLISHED) {
                sort = { created_date: -1 };
            }

            var product = await this.productService.search(filter, sort, pageLimit, skip);
            const searchProduct = await this.wishlistService.getByFilter({ user_id: user.id });
            const productIds = searchProduct.map((data) => data.product_id?.toString());
            const makeOffer = await this.makeOfferService.filter({
                customer_id: user.id,
                is_offer_active: true,
            });
            // const makeOfferIds = makeOffer.map((data) => data.product_id?.toString());
            // const filterProduct = product?.productList?.filter(data => makeOfferIds.includes(data?._id?.toString()))

            const newProduct =
                product?.productList?.length > 0
                    ? product?.productList?.map((pro) => {
                        const data = makeOffer?.filter(
                            (data) =>
                                data?.product_id?.toString() === pro._id?.toString() &&
                                data?.price
                        );

                        if (data?.length > 0) {
                            pro.discount_price = data[0].price;
                            pro.make_offer = true;
                        } else {
                            pro.make_offer = false;
                        }

                        if (productIds && productIds.includes(pro && pro._id?.toString())) {
                            pro.wishlist = true;
                            return pro;
                        } else {
                            pro.wishlist = false;
                            return pro;
                        }
                    })
                    : [];
            if (product) {
                response(res, HTTP_STATUS.SUCCESS, 'product_search', newProduct);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'product_bad_request');
            return;
        } catch (error) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    autoSuggest = async (req, res) => {
        try {
            const { search } = req?.body;
            const user = tokenInfo(req, res);
            const filter = {
                $and: [
                    {
                        $or: [
                            { description: { $regex: search, $options: 'i' } },
                            { name: { $regex: search, $options: 'i' } },
                        ],
                    },
                    {
                        created_by: { $ne: user.id }
                    },
                    {
                        qty: {
                            $gte: 1
                        }
                    }
                ]
            };
            var product = await this.productService.autoSuggest(filter);
            if (product) {
                response(res, HTTP_STATUS.SUCCESS, 'product_compare', product);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'product_bad_request');
            return;
        } catch (error) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    view = async (req, res) => {
        try {
            const id = req?.params?.seller_id;
            const user = tokenInfo(req, res);

            if (id !== user.id) {
                const result = await this.productService.update(id);
                if (result) {
                    response(res, HTTP_STATUS.SUCCESS, 'product_view', result);
                    return;
                }
                response(res, HTTP_STATUS.BAD_REQUEST, 'product_bad_request');
                return;
            } else {
                response(res, HTTP_STATUS.SUCCESS, 'product_view', 1);
                return;
            }
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };
}

export default ProductController;
