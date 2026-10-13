
import express from 'express';


// ========================================
// HOME CONTROLLER
// ========================================

import {
  showHomePage
} from './controllers/index.js';


// ========================================
// ORGANIZATIONS CONTROLLER
// ========================================

import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
  newOrganizationValidation,
  editOrganizationValidation
} from './controllers/organizations.js';


// ========================================
// PROJECTS CONTROLLER
// ========================================

import {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation
} from './controllers/projects.js';


// ========================================
// CATEGORIES CONTROLLER
// ========================================

import {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation
} from './controllers/categories.js';


// ========================================
// ERROR CONTROLLER
// ========================================

import {
  testErrorPage
} from './controllers/errors.js';


// ========================================
// EXPRESS ROUTER
// ========================================

const router = express.Router();


// ========================================
// HOME ROUTE
// ========================================

router.get(
  '/',
  showHomePage
);


// ========================================
// ORGANIZATION ROUTES
// ========================================

// Show all organizations
router.get(
  '/organizations',
  showOrganizationsPage
);

// Show new organization form
router.get(
  '/new-organization',
  showNewOrganizationForm
);

// Create organization
router.post(
  '/new-organization',
  newOrganizationValidation,
  processNewOrganizationForm
);

// Show edit organization form
router.get(
  '/edit-organization/:id',
  showEditOrganizationForm
);

// Update organization
router.post(
  '/edit-organization/:id',
  editOrganizationValidation,
  processEditOrganizationForm
);

// Show organization details
router.get(
  '/organization/:id',
  showOrganizationDetailsPage
);


// ========================================
// PROJECT ROUTES
// ========================================

// Show all projects
router.get(
  '/projects',
  showProjectsPage
);

// Show new project form
router.get(
  '/new-project',
  showNewProjectForm
);

// Create project
router.post(
  '/new-project',
  projectValidation,
  processNewProjectForm
);

// Show edit project form
router.get(
  '/edit-project/:id',
  showEditProjectForm
);

// Update project
router.post(
  '/edit-project/:id',
  projectValidation,
  processEditProjectForm
);

// Show project details
router.get(
  '/project/:id',
  showProjectDetailsPage
);


// ========================================
// CATEGORY ROUTES
// ========================================

// Show all categories
router.get(
  '/categories',
  showCategoriesPage
);

// Show new category form
router.get(
  '/new-category',
  showNewCategoryForm
);

// Create category
router.post(
  '/new-category',
  categoryValidation,
  processNewCategoryForm
);

// Show edit category form
router.get(
  '/edit-category/:id',
  showEditCategoryForm
);

// Update category
router.post(
  '/edit-category/:id',
  categoryValidation,
  processEditCategoryForm
);

// Show category details
router.get(
  '/category/:id',
  showCategoryDetailsPage
);


// ========================================
// ERROR TEST ROUTE
// ========================================

router.get(
  '/test-error',
  testErrorPage
);


// ========================================
// EXPORT ROUTER
// ========================================

export default router;
