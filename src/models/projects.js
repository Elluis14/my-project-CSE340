import db from "./db.js";


// Get all projects
const getAllProjects = async () => {
  const query = `
    SELECT
      sp.project_id,
      sp.organization_id,
      sp.title,
      sp.description,
      sp.location,
      sp.date,
      o.name AS organization_name
    FROM public.service_project sp
    INNER JOIN public.organization o
      ON sp.organization_id = o.organization_id
    ORDER BY sp.date;
  `;

  const result = await db.query(query);

  return result.rows;
};


// Get projects by category ID
const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT
      sp.project_id,
      sp.organization_id,
      sp.title,
      sp.description,
      sp.location,
      sp.date
    FROM public.service_project sp
    INNER JOIN public.project_category pc
      ON sp.project_id = pc.project_id
    WHERE pc.category_id = $1
    ORDER BY sp.date;
  `;

  const result = await db.query(
    query,
    [categoryId]
  );

  return result.rows;
};


// Get projects by organization ID
const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT
      project_id,
      organization_id,
      title,
      description,
      location,
      date
    FROM public.service_project
    WHERE organization_id = $1
    ORDER BY date;
  `;

  const queryParams = [organizationId];

  const result = await db.query(
    query,
    queryParams
  );

  return result.rows;
};

const getProjectById = async (projectId) => {
  const query = `
    SELECT
      sp.project_id,
      sp.organization_id,
      sp.title,
      sp.description,
      sp.location,
      sp.date,
      o.name AS organization_name
    FROM public.service_project sp
    INNER JOIN public.organization o
      ON sp.organization_id = o.organization_id
    WHERE sp.project_id = $1;
  `;

  const result = await db.query(
    query,
    [projectId]
  );

  return result.rows.length > 0
    ? result.rows[0]
    : null;
};
// Export model functions
export {
  getAllProjects,
  getProjectsByCategoryId,
  getProjectsByOrganizationId,
  getProjectById
};