
import db from "./db.js";




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


// ========================================
// GET PROJECTS BY CATEGORY ID
// ========================================

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


// ========================================
// GET PROJECTS BY ORGANIZATION ID
// ========================================

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

  const result = await db.query(
    query,
    [organizationId]
  );

  return result.rows;
};


// ========================================
// GET PROJECT BY ID
// ========================================

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


// ========================================
// GET CATEGORY IDS BY PROJECT ID
// ========================================

const getCategoryIdsByProjectId = async (projectId) => {

  const query = `
    SELECT category_id
    FROM public.project_category
    WHERE project_id = $1
    ORDER BY category_id;
  `;

  const result = await db.query(
    query,
    [projectId]
  );

  return result.rows.map(
    (row) => row.category_id
  );
};


// ========================================
// HELPER: INSERT PROJECT CATEGORIES
// ========================================

const insertProjectCategories = async (
  client,
  projectId,
  categoryIds
) => {

  const uniqueIds = [
    ...new Set(categoryIds)
  ];

  for (const categoryId of uniqueIds) {

    await client.query(
      `
        INSERT INTO public.project_category (
          project_id,
          category_id
        )
        VALUES ($1, $2);
      `,
      [projectId, categoryId]
    );

  }

};


// ========================================
// CREATE PROJECT
// ========================================

const createProject = async (
  projectData,
  categoryIds = []
) => {

  const {
    organization_id,
    title,
    description,
    location,
    date
  } = projectData;

  const client = await db.connect();

  try {

    await client.query("BEGIN");

    const query = `
      INSERT INTO public.service_project (
        organization_id,
        title,
        description,
        location,
        date
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const result = await client.query(
      query,
      [
        organization_id,
        title,
        description,
        location,
        date
      ]
    );

    const projectId =
      result.rows[0].project_id;

    await insertProjectCategories(
      client,
      projectId,
      categoryIds
    );

    await client.query("COMMIT");

    return projectId;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ========================================
// UPDATE PROJECT
// ========================================

const updateProject = async (
  projectId,
  projectData,
  categoryIds = []
) => {

  const {
    organization_id,
    title,
    description,
    location,
    date
  } = projectData;

  const client = await db.connect();

  try {

    await client.query("BEGIN");

    const query = `
      UPDATE public.service_project
      SET
        organization_id = $1,
        title = $2,
        description = $3,
        location = $4,
        date = $5
      WHERE project_id = $6
      RETURNING project_id;
    `;

    const result = await client.query(
      query,
      [
        organization_id,
        title,
        description,
        location,
        date,
        projectId
      ]
    );

    if (result.rows.length === 0) {

      await client.query("ROLLBACK");

      return null;

    }

    // Remove previous category relationships
    await client.query(
      `
        DELETE FROM public.project_category
        WHERE project_id = $1;
      `,
      [projectId]
    );

    // Save the selected categories
    await insertProjectCategories(
      client,
      projectId,
      categoryIds
    );

    await client.query("COMMIT");

    return result.rows[0].project_id;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ========================================
// SAVE PROJECT CATEGORIES
// ========================================

const saveProjectCategories = async (
  projectId,
  categoryIds = []
) => {

  const client = await db.connect();

  try {

    await client.query("BEGIN");

    // Lock the parent project to serialize updates
    const projectResult = await client.query(
      `
        SELECT project_id
        FROM public.service_project
        WHERE project_id = $1
        FOR UPDATE;
      `,
      [projectId]
    );

    if (projectResult.rows.length === 0) {

      await client.query("ROLLBACK");

      return null;

    }

    await client.query(
      `
        DELETE FROM public.project_category
        WHERE project_id = $1;
      `,
      [projectId]
    );

    await insertProjectCategories(
      client,
      projectId,
      categoryIds
    );

    await client.query("COMMIT");

    return projectId;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};

export {
  getAllProjects,
  getProjectsByCategoryId,
  getProjectsByOrganizationId,
  getProjectById,
  getCategoryIdsByProjectId,
  createProject,
  updateProject,
  saveProjectCategories
};
