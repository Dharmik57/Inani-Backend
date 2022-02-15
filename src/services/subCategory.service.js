import SubCategoryModel from '../models/subCategory';

class SubCategoryService {
    add = (data) => {
        return SubCategoryModel.create(data);
    };

    get = () => {
        return SubCategoryModel.find();
    };
}

export default SubCategoryService;
