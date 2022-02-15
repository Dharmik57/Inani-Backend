import CategoryModel from '../models/category';

class CategoryService {
    add = (data) => {
        return CategoryModel.create(data);
    };

    get = (data) => {
        return CategoryModel.find({
            isActive: true,
        });
    };
}

export default CategoryService;
