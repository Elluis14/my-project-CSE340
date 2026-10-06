import {
  getAllCategories,
  getCategoryById
} from '../models/categories.js';

import {
  getProjectsByCategoryId
} from '../models/projects.js';


// Show all categories
const showCategoriesPage = async (req, res) => {

  const categories =
    await getAllCategories();

  const title =
    'Service Categories';

  res.render(
    'categories',
    {
      title,
      categories
    }
  );

};


// Show details for one category
const showCategoryDetailsPage = async (req, res) => {

  const categoryId =
    req.params.id;

  const categoryDetails =
    await getCategoryById(
      categoryId
    );

  const projects =
    await getProjectsByCategoryId(
      categoryId
    );

  const title =
    categoryDetails
      ? categoryDetails.name
      : 'Category Not Found';

  res.render(
    'category',
    {
      title,
      categoryDetails,
      projects
    }
  );

};


// Export controller functions
export {
  showCategoriesPage,
  showCategoryDetailsPage
};