import ProductModel from '../models/products';

class FilterService {
    get = async () => {
        const size = await ProductModel.find({
            qty: {
                $gte: 1
            }
        }).distinct('size').sort();
        const brand = await ProductModel.find({
            qty: {
                $gte: 1
            }
        }).distinct('brand').sort();
        const condition = await ProductModel.find({
            qty: {
                $gte: 1
            }
        }).distinct('condition').sort();
        const priceMin = await ProductModel.findOne({
            qty: {
                $gte: 1
            }
        }).sort({ price: 1 }).limit(1);
        const priceMax = await ProductModel.findOne({
            qty: {
                $gte: 1
            }
        }).sort({ price: -1 }).limit(1);
        const priceValue = {
            min: (priceMin && priceMin.price) || 0,
            max: (priceMax && priceMax.price) || 99999,
        };

        return {
            size,
            brand,
            condition,
            price: priceValue,
        };
    };

    getBrands = async () => {
        const brand = await ProductModel.find().distinct('brand').sort();
        return { brand };
    };
}

export default FilterService;
