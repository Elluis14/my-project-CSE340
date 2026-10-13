
import bcrypt from 'bcrypt';
import db from './db.js';

// Create a new user with the default "user" role
const createUser = async (name, email, passwordHash) => {
  const query = `
    INSERT INTO users (
      name,
      email,
      password_hash,
      role_id
    )
    VALUES (
      $1,
      $2,
      $3,
      (
        SELECT role_id
        FROM roles
        WHERE role_name = 'user'
      )
    )
    RETURNING user_id, name, email, role_id
  `;

  const result = await db.query(query, [
    name,
    email,
    passwordHash
  ]);

  return result.rows[0];
};

// Find a user by email
const findUserByEmail = async (email) => {
  const query = `
    SELECT
      u.user_id,
      u.name,
      u.email,
      u.password_hash,
      u.role_id,
      r.role_name
    FROM users AS u
    INNER JOIN roles AS r
      ON u.role_id = r.role_id
    WHERE u.email = $1
  `;

  const result = await db.query(query, [email]);

  return result.rows[0] || null;
};

// Verify password against stored hash
const verifyPassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

// Authenticate user credentials
const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(
    password,
    user.password_hash
  );

  if (!isValid) {
    return null;
  }

  const { password_hash, ...safeUser } = user;

  return safeUser;
};

// Retrieve all users for the admin page
const getAllUsers = async () => {
  const query = `
    SELECT
      u.user_id,
      u.name,
      u.email,
      r.role_name
    FROM users AS u
    INNER JOIN roles AS r
      ON u.role_id = r.role_id
    ORDER BY u.name ASC
  `;

  const result = await db.query(query);

  return result.rows;
};

export {
  createUser,
  findUserByEmail,
  authenticateUser,
  getAllUsers
};
