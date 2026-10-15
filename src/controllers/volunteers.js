import {
  addVolunteer,
  removeVolunteer
} from '../models/volunteers.js';

// Validate project IDs from URLs.
const getValidProjectId = (value) => {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

// Register the authenticated user as a volunteer.
const processVolunteer = async (req, res, next) => {
  try {
    const userId = req.session.user.user_id;
    const projectId = getValidProjectId(req.params.id);

    if (!projectId) {
      return res.status(400).send('Invalid project ID.');
    }

    const result = await addVolunteer(userId, projectId);

    req.session.successMessage = result
      ? 'You have successfully volunteered for this project.'
      : 'You are already volunteering for this project.';

    return res.redirect(`/project/${projectId}`);

  } catch (error) {
    next(error);
  }
};

// Remove the authenticated user's volunteering.
const processUnvolunteer = async (req, res, next) => {
  try {
    const userId = req.session.user.user_id;
    const projectId = getValidProjectId(req.params.id);

    if (!projectId) {
      return res.status(400).send('Invalid project ID.');
    }

    const result = await removeVolunteer(userId, projectId);

    req.session.successMessage = result
      ? 'You have successfully removed your volunteering.'
      : 'You are not volunteering for this project.';

    return res.redirect(`/project/${projectId}`);

  } catch (error) {
    next(error);
  }
};

export {
  processVolunteer,
  processUnvolunteer
};
