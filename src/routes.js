
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


import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard,
  showUsers
} from './controllers/users.js';


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

 router.get('/organizations', showOrganizationsPage);

 router.get(
   '/new-organization',
   requireLogin,
   requireRole('admin'),
   showNewOrganizationForm
 );

 router.post(
   '/new-organization',
   requireLogin,
   requireRole('admin'),
   newOrganizationValidation,
   processNewOrganizationForm
 );

 router.get(
   '/edit-organization/:id',
   requireLogin,
   requireRole('admin'),
   showEditOrganizationForm
 );

 router.post(
   '/edit-organization/:id',
   requireLogin,
   requireRole('admin'),
   editOrganizationValidation,
   processEditOrganizationForm
 );

 router.get('/organization/:id', showOrganizationDetailsPage);


 // ========================================
 // PROJECT ROUTES
 // ========================================

 router.get('/projects', showProjectsPage);

 router.get(
   '/new-project',
   requireLogin,
   requireRole('admin'),
   showNewProjectForm
 );

 router.post(
   '/new-project',
   requireLogin,
   requireRole('admin'),
   projectValidation,
   processNewProjectForm
 );

 router.get(
   '/edit-project/:id',
   requireLogin,
   requireRole('admin'),
   showEditProjectForm
 );

 router.post(
   '/edit-project/:id',
   requireLogin,
   requireRole('admin'),
   projectValidation,
   processEditProjectForm
 );

 router.get('/project/:id', showProjectDetailsPage);


 // ========================================
 // CATEGORY ROUTES
 // ========================================

 router.get('/categories', showCategoriesPage);

 router.get(
   '/new-category',
   requireLogin,
   requireRole('admin'),
   showNewCategoryForm
 );

 router.post(
   '/new-category',
   requireLogin,
   requireRole('admin'),
   categoryValidation,
   processNewCategoryForm
 );

 router.get(
   '/edit-category/:id',
   requireLogin,
   requireRole('admin'),
   showEditCategoryForm
 );

 router.post(
   '/edit-category/:id',
   requireLogin,
   requireRole('admin'),
   categoryValidation,
   processEditCategoryForm
 );

 router.get('/category/:id', showCategoryDetailsPage);



// ========================================
// ERROR TEST ROUTE
// ========================================

router.get(
  '/test-error',
  testErrorPage
);


// ========================================
// W05 - AUTHENTICATION ROUTES
// ========================================

// Registration
router.get(
  '/register',
  showUserRegistrationForm
);

router.post(
  '/register',
  processUserRegistrationForm
);

// Login
router.get(
  '/login',
  showLoginForm
);

router.post(
  '/login',
  processLoginForm
);

// Logout
router.post(
  '/logout',
  requireLogin,
  processLogout
);

// Dashboard - authenticated users only
router.get(
  '/dashboard',
  requireLogin,
  showDashboard
);

// User list - administrators only
router.get(
  '/users',
  requireLogin,
  requireRole('admin'),
  showUsers
);

// ========================================
// EXPORT ROUTER
// ========================================

export default router;
