import db from "./db.js";

const getAllCategories = async () => {
  const query = `
    SELECT
      category_id,
      name
    FROM public.category
    ORDER BY name;
  `;

  const result = await db.query(query);

  return result.rows;
};

const getCategoryById = async (categoryId) => {
  const query = `
    SELECT
      category_id,
      name
    FROM public.category
    WHERE category_id = $1;
  `;

  const result = await db.query(query, [categoryId]);

  return result.rows[0];
};

const getCategoriesByProjectId = async (projectId) => {
  const query = `
    SELECT
      c.category_id,
      c.name
    FROM public.category c
    INNER JOIN public.project_category pc
      ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.name;
  `;

  const result = await db.query(query, [projectId]);

  return result.rows;
};

const createCategory = async (name) => {
  const query = `
    INSERT INTO public.category (name)
    VALUES ($1)
    RETURNING category_id;
  `;

  const result = await db.query(query, [name]);

  if (result.rows.length === 0) {
    throw new Error("Failed to create category");
  }

  return result.rows[0].category_id;
};
const updateCategory = async (categoryId, name) => {
  const query = `
    UPDATE public.category
    SET name = $1
    WHERE category_id = $2
    RETURNING category_id;
  `;

  const result = await db.query(query, [
    name,
    categoryId
  ]);

  if (result.rows.length === 0) {
    throw new Error("Category not found");
  }

  return result.rows[0].category_id;
};
export {
  getAllCategories,
  getCategoryById,
  getCategoriesByProjectId,
  createCategory,
  updateCategory
};