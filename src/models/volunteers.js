import db from './db.js';

// Add a user as a volunteer for a project.
// ON CONFLICT prevents duplicate registrations.
const addVolunteer = async (userId, projectId) => {
  const query = `
    INSERT INTO volunteer (user_id, project_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, project_id) DO NOTHING
    RETURNING user_id, project_id
  `;

  const result = await db.query(query, [
    userId,
    projectId
  ]);

  return result.rows[0] || null;
};

// Remove a user from a volunteer project.
const removeVolunteer = async (userId, projectId) => {
  const query = `
    DELETE FROM volunteer
    WHERE user_id = $1
      AND project_id = $2
    RETURNING user_id, project_id
  `;

  const result = await db.query(query, [
    userId,
    projectId
  ]);

  return result.rows[0] || null;
};

// Get all projects a user has volunteered for.
const getUserVolunteerProjects = async (userId) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.date,
      p.location,
      o.name AS organization_name,
      v.volunteered_at
    FROM volunteer AS v
    INNER JOIN service_project AS p
      ON v.project_id = p.project_id
    INNER JOIN organization AS o
      ON p.organization_id = o.organization_id
    WHERE v.user_id = $1
    ORDER BY p.date ASC, p.title ASC
  `;

  const result = await db.query(query, [userId]);

  return result.rows;
};

// Check whether a user is already volunteering.
const isUserVolunteering = async (userId, projectId) => {
  const query = `
    SELECT EXISTS (
      SELECT 1
      FROM volunteer
      WHERE user_id = $1
        AND project_id = $2
    ) AS is_volunteering
  `;

  const result = await db.query(query, [
    userId,
    projectId
  ]);

  return result.rows[0].is_volunteering;
};

export {
  addVolunteer,
  removeVolunteer,
  getUserVolunteerProjects,
  isUserVolunteering
};
