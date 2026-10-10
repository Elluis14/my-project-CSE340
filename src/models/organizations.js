import db from "./db.js";


// Get all organizations
const getAllOrganizations = async () => {
  const query = `
    SELECT
      organization_id,
      name,
      description,
      contact_email,
      logo_filename
    FROM public.organization;
  `;

  const result = await db.query(query);

  return result.rows;
};


// Get one organization by its ID
const getOrganizationDetails = async (organizationId) => {
  const query = `
    SELECT
      organization_id,
      name,
      description,
      contact_email,
      logo_filename
    FROM public.organization
    WHERE organization_id = $1;
  `;

  const queryParams = [organizationId];

  const result = await db.query(
    query,
    queryParams
  );

  return result.rows.length > 0
    ? result.rows[0]
    : null;
};


// Create a new organization
const createOrganization = async (organizationData) => {

  const {
    name,
    description,
    contact_email,
    logo_filename
  } = organizationData;

  const query = `
    INSERT INTO public.organization (
      name,
      description,
      contact_email,
      logo_filename
    )
    VALUES ($1, $2, $3, $4)
    RETURNING organization_id;
  `;

  const queryParams = [
    name,
    description,
    contact_email,
    logo_filename
  ];

  const result = await db.query(
    query,
    queryParams
  );

  return result.rows[0].organization_id;
};

// Update an existing organization
const updateOrganization = async (
  organizationId,
  organizationData
) => {

  const {
    name,
    description,
    contact_email,
    logo_filename
  } = organizationData;

  const query = `
    UPDATE public.organization
    SET
      name = $1,
      description = $2,
      contact_email = $3,
      logo_filename = $4
    WHERE organization_id = $5
    RETURNING organization_id;
  `;

  const queryParams = [
    name,
    description,
    contact_email,
    logo_filename,
    organizationId
  ];

  const result = await db.query(
    query,
    queryParams
  );

  return result.rows.length > 0
    ? result.rows[0].organization_id
    : null;
};

// Export model functions
export {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
  updateOrganization
};