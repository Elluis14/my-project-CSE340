import {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
  updateOrganization,
} from "../models/organizations.js";

import { getProjectsByOrganizationId } from "../models/projects.js";

import { body, validationResult } from "express-validator";

// Organization form validation
const organizationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required.")
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage("Organization name must be between 3 and 150 characters."),

  body("description").trim().notEmpty().withMessage("Description is required."),

  body("contact_email")
    .trim()
    .notEmpty()
    .withMessage("Contact email is required.")
    .bail()
    .isEmail()
    .withMessage("Enter a valid email address.")
    .bail()
    .isLength({ max: 255 })
    .withMessage("Email must not exceed 255 characters."),

  body("logo_filename")
    .trim()
    .notEmpty()
    .withMessage("Logo filename is required.")
    .bail()
    .isLength({ max: 255 })
    .withMessage("Logo filename must not exceed 255 characters."),
];

// Show all organizations
const showOrganizationsPage = async (req, res) => {
  const organizations = await getAllOrganizations();

  res.render("organizations", {
    title: "Our Partner Organizations",
    organizations,
  });
};

// Show details for one organization
const showOrganizationDetailsPage = async (req, res) => {
  const organizationId = req.params.id;

  const organizationDetails = await getOrganizationDetails(organizationId);

  if (!organizationDetails) {
    const error = new Error("Organization Not Found");
    error.status = 404;
    throw error;
  }

  const projects = await getProjectsByOrganizationId(organizationId);

  res.render("organization", {
    title: "Organization Details",
    organizationDetails,
    projects,
  });
};

// Show the new organization form
const showNewOrganizationForm = (req, res) => {
  res.render("new-organization", {
    title: "Add New Organization",
    organization: {
      name: "",
      description: "",
      contact_email: "",
      logo_filename: "",
    },
    errors: [],
  });
};

// Process the new organization form
const processNewOrganizationForm = async (req, res) => {
  const results = validationResult(req);

  const organization = {
    name: req.body.name ?? "",
    description: req.body.description ?? "",
    contact_email: req.body.contact_email ?? "",
    logo_filename: req.body.logo_filename ?? "",
  };

  if (!results.isEmpty()) {
    return res.status(400).render("new-organization", {
      title: "Add New Organization",
      organization,
      errors: results.array(),
    });
  }

  const organizationId = await createOrganization(organization);

  return res.redirect(`/organization/${organizationId}`);
};

// Show the edit organization form
const showEditOrganizationForm = async (req, res) => {
  const organizationId = req.params.id;

  const organization = await getOrganizationDetails(organizationId);

  if (!organization) {
    const error = new Error("Organization Not Found");
    error.status = 404;
    throw error;
  }

  res.render("edit-organization", {
    title: "Edit Organization",
    organization,
    errors: [],
  });
};

// Process the edit organization form
const processEditOrganizationForm = async (req, res) => {
  const organizationId = req.params.id;

  const existingOrganization = await getOrganizationDetails(organizationId);

  if (!existingOrganization) {
    const error = new Error("Organization Not Found");
    error.status = 404;
    throw error;
  }

  const organization = {
    organization_id: existingOrganization.organization_id,
    name: req.body.name ?? "",
    description: req.body.description ?? "",
    contact_email: req.body.contact_email ?? "",
    logo_filename: req.body.logo_filename ?? "",
  };

  const results = validationResult(req);

  if (!results.isEmpty()) {
    return res.status(400).render("edit-organization", {
      title: "Edit Organization",
      organization,
      errors: results.array(),
    });
  }

  const updatedId = await updateOrganization(organizationId, organization);

  if (updatedId === null) {
    const error = new Error("Organization Not Found");
    error.status = 404;
    throw error;
  }

  return res.redirect(`/organization/${updatedId}`);
};

// Export controller functions
export {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
  organizationValidation,
};
