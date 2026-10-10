
import {
  getAllProjects,
  getProjectById,
  getCategoryIdsByProjectId,
  createProject,
  updateProject
} from '../models/projects.js';

import {
  getAllCategories,
  getCategoriesByProjectId
} from '../models/categories.js';

import {
  getAllOrganizations
} from '../models/organizations.js';

import {
  body,
  validationResult
} from 'express-validator';


// ========================================
// PROJECT VALIDATION
// ========================================

const projectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required.')
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage(
      'Project title must be between 3 and 150 characters.'
    ),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required.'),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Project location is required.')
    .bail()
    .isLength({ max: 255 })
    .withMessage(
      'Location must not exceed 255 characters.'
    ),

  body('date')
    .notEmpty()
    .withMessage('Project date is required.')
    .bail()
    .isISO8601({ strict: true })
    .withMessage('Enter a valid project date.'),

  body('organization_id')
    .notEmpty()
    .withMessage('Please select an organization.')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Select a valid organization.'),

  body('category_ids')
    .optional()
    .custom((value) => {
      const values = Array.isArray(value)
        ? value
        : [value];

      return values.every((id) =>
        /^[1-9]\d*$/.test(String(id))
      );
    })
    .withMessage('Select valid categories.')
];


// ========================================
// HELPER FUNCTIONS
// ========================================

// Convert PostgreSQL date to YYYY-MM-DD
const formatDateForInput = (value) => {
  if (!value) {
    return '';
  }

  if (value instanceof Date) {
    return [
      value.getUTCFullYear(),
      String(value.getUTCMonth() + 1).padStart(2, '0'),
      String(value.getUTCDate()).padStart(2, '0')
    ].join('-');
  }

  return String(value).slice(0, 10);
};


// Normalize selected category IDs
const normalizeCategoryIds = (value) => {
  if (value === undefined || value === null) {
    return [];
  }

  return (Array.isArray(value) ? value : [value])
    .map((id) => String(id));
};


// Build form data from the request
const getProjectFormData = (req) => ({
  title: req.body.title ?? '',
  description: req.body.description ?? '',
  location: req.body.location ?? '',
  date: req.body.date ?? '',
  organization_id: req.body.organization_id ?? ''
});


// Load options for both forms
const getFormOptions = async () => {
  const [organizations, categories] = await Promise.all([
    getAllOrganizations(),
    getAllCategories()
  ]);

  return {
    organizations,
    categories
  };
};


// Check that selected IDs exist
const validateSelections = (
  project,
  categoryIds,
  organizations,
  categories
) => {
  const errors = [];

  const validOrganization = organizations.some(
    (organization) =>
      String(organization.organization_id) ===
      String(project.organization_id)
  );

  if (!validOrganization) {
    errors.push({
      msg: 'Please select an existing organization.'
    });
  }

  const validCategoryIds = new Set(
    categories.map((category) =>
      String(category.category_id)
    )
  );

  if (
    categoryIds.some((id) => !validCategoryIds.has(id))
  ) {
    errors.push({
      msg: 'One or more selected categories do not exist.'
    });
  }

  return errors;
};


// ========================================
// SHOW ALL PROJECTS
// ========================================

const showProjectsPage = async (req, res) => {
  const projects = await getAllProjects();

  res.render('projects', {
    title: 'Service Projects',
    projects
  });
};


// ========================================
// SHOW PROJECT DETAILS
// ========================================

const showProjectDetailsPage = async (req, res) => {
  const projectId = req.params.id;

  const projectDetails =
    await getProjectById(projectId);

  if (!projectDetails) {
    const error = new Error('Project Not Found');
    error.status = 404;
    throw error;
  }

  const categories =
    await getCategoriesByProjectId(projectId);

  res.render('project', {
    title: projectDetails.title,
    projectDetails,
    categories
  });
};


// ========================================
// SHOW NEW PROJECT FORM
// ========================================

const showNewProjectForm = async (req, res) => {
  const options = await getFormOptions();

  res.render('new-project', {
    title: 'Add New Project',
    project: {
      title: '',
      description: '',
      location: '',
      date: '',
      organization_id: ''
    },
    selectedCategoryIds: [],
    errors: [],
    ...options
  });
};


// ========================================
// PROCESS NEW PROJECT FORM
// ========================================

const processNewProjectForm = async (req, res) => {
  const project = getProjectFormData(req);

  const selectedCategoryIds =
    normalizeCategoryIds(req.body.category_ids);

  const options = await getFormOptions();

  const errors = [
    ...validationResult(req).array(),
    ...validateSelections(
      project,
      selectedCategoryIds,
      options.organizations,
      options.categories
    )
  ];

  if (errors.length > 0) {
    return res.status(400).render('new-project', {
      title: 'Add New Project',
      project,
      selectedCategoryIds,
      errors,
      ...options
    });
  }

  try {
    const projectId = await createProject(
      project,
      selectedCategoryIds
    );

    return res.redirect(`/project/${projectId}`);

  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).render('new-project', {
        title: 'Add New Project',
        project,
        selectedCategoryIds,
        errors: [
          {
            msg: 'An organization or category no longer exists.'
          }
        ],
        ...options
      });
    }

    throw error;
  }
};


// ========================================
// SHOW EDIT PROJECT FORM
// ========================================

const showEditProjectForm = async (req, res) => {
  const projectId = req.params.id;

  const project = await getProjectById(projectId);

  if (!project) {
    const error = new Error('Project Not Found');
    error.status = 404;
    throw error;
  }

  const selectedCategoryIds =
    await getCategoryIdsByProjectId(projectId);

  const options = await getFormOptions();

  res.render('edit-project', {
    title: 'Edit Project',
    project: {
      ...project,
      date: formatDateForInput(project.date)
    },
    selectedCategoryIds:
      selectedCategoryIds.map(String),
    errors: [],
    ...options
  });
};


// ========================================
// PROCESS EDIT PROJECT FORM
// ========================================

const processEditProjectForm = async (req, res) => {
  const projectId = req.params.id;

  const existingProject =
    await getProjectById(projectId);

  if (!existingProject) {
    const error = new Error('Project Not Found');
    error.status = 404;
    throw error;
  }

  const project = {
    ...getProjectFormData(req),
    project_id: existingProject.project_id
  };

  const selectedCategoryIds =
    normalizeCategoryIds(req.body.category_ids);

  const options = await getFormOptions();

  const errors = [
    ...validationResult(req).array(),
    ...validateSelections(
      project,
      selectedCategoryIds,
      options.organizations,
      options.categories
    )
  ];

  if (errors.length > 0) {
    return res.status(400).render('edit-project', {
      title: 'Edit Project',
      project,
      selectedCategoryIds,
      errors,
      ...options
    });
  }

  try {
    const updatedId = await updateProject(
      projectId,
      project,
      selectedCategoryIds
    );

    if (updatedId === null) {
      const error = new Error('Project Not Found');
      error.status = 404;
      throw error;
    }

    return res.redirect(`/project/${updatedId}`);

  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).render('edit-project', {
        title: 'Edit Project',
        project,
        selectedCategoryIds,
        errors: [
          {
            msg: 'An organization or category no longer exists.'
          }
        ],
        ...options
      });
    }

    throw error;
  }
};


// ========================================
// EXPORT CONTROLLER FUNCTIONS
// ========================================

export {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation
};
