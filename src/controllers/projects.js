import {
  getAllProjects,
  getProjectById
} from '../models/projects.js';

import {
  getCategoriesByProjectId
} from '../models/categories.js';


// Show all projects
const showProjectsPage = async (req, res) => {

  const projects =
    await getAllProjects();

  const title =
    'Service Projects';

  res.render(
    'projects',
    {
      title,
      projects
    }
  );

};


// Show details for one project
const showProjectDetailsPage = async (req, res) => {

  const projectId =
    req.params.id;

  const projectDetails =
    await getProjectById(
      projectId
    );

  const categories =
    await getCategoriesByProjectId(
      projectId
    );

  const title =
    projectDetails
      ? projectDetails.title
      : 'Project Not Found';

  res.render(
    'project',
    {
      title,
      projectDetails,
      categories
    }
  );

};


// Export controller functions
export {
  showProjectsPage,
  showProjectDetailsPage
};