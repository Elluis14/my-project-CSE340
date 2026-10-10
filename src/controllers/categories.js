
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory
} from '../models/categories.js';

import {
  getProjectsByCategoryId
} from '../models/projects.js';

import {
  body,
  validationResult
} from 'express-validator';



const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required.')
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage(
      'Category name must be between 3 and 100 characters.'
    )
];



const showCategoriesPage = async (req, res) => {

  const categories = await getAllCategories();

  const title = 'Service Categories';

  res.render('categories', {
    title,
    categories
  });

};


const showCategoryDetailsPage = async (req, res) => {

  const categoryId = req.params.id;

  const categoryDetails =
    await getCategoryById(categoryId);

  if (!categoryDetails) {
    const error = new Error('Category Not Found');
    error.status = 404;
    throw error;
  }

  const projects =
    await getProjectsByCategoryId(categoryId);

  const title = categoryDetails.name;

  res.render('category', {
    title,
    categoryDetails,
    projects
  });

};


const showNewCategoryForm = (req, res) => {

  res.render('new-category', {
    title: 'Add New Category',
    name: '',
    errors: []
  });

};


const processNewCategoryForm = async (req, res) => {

  const results = validationResult(req);

  const name = req.body.name ?? '';

  // Check validation errors
  if (!results.isEmpty()) {

    return res.status(400).render('new-category', {
      title: 'Add New Category',
      name,
      errors: results.array()
    });

  }

  try {

    // Insert category into database
    const categoryId = await createCategory(name);

    // Redirect to category details
    return res.redirect(`/category/${categoryId}`);

  } catch (error) {

    // PostgreSQL unique constraint violation
    if (error.code === '23505') {

      return res.status(400).render('new-category', {
        title: 'Add New Category',
        name,
        errors: [
          {
            msg: 'This category name already exists.'
          }
        ]
      });

    }

    throw error;

  }

};



const showEditCategoryForm = async (req, res) => {

  const categoryId = req.params.id;

  const category =
    await getCategoryById(categoryId);

  // Check if category exists
  if (!category) {

    const error = new Error('Category Not Found');
    error.status = 404;
    throw error;

  }

  res.render('edit-category', {
    title: 'Edit Category',
    category,
    errors: []
  });

};



const processEditCategoryForm = async (req, res) => {

  const categoryId = req.params.id;

  const results = validationResult(req);

  const name = req.body.name ?? '';

  // Get existing category
  const category =
    await getCategoryById(categoryId);

  // Check if category exists
  if (!category) {

    const error = new Error('Category Not Found');
    error.status = 404;
    throw error;

  }

  // Check validation errors
  if (!results.isEmpty()) {

    return res.status(400).render('edit-category', {
      title: 'Edit Category',
      category: {
        ...category,
        name
      },
      errors: results.array()
    });

  }

  try {

    // Update category in database
    await updateCategory(categoryId, name);

    // Redirect to category details
    return res.redirect(`/category/${categoryId}`);

  } catch (error) {

    // PostgreSQL unique constraint violation
    if (error.code === '23505') {

      return res.status(400).render('edit-category', {
        title: 'Edit Category',
        category: {
          ...category,
          name
        },
        errors: [
          {
            msg: 'This category name already exists.'
          }
        ]
      });

    }

    throw error;

  }

};


export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation
};
