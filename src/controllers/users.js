
import bcrypt from 'bcrypt';

import {
  createUser,
  findUserByEmail,
  authenticateUser,
  getAllUsers
} from '../models/users.js';

// ========================================
// REGISTRATION
// ========================================

const showUserRegistrationForm = (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }

  res.render('register', {
    title: 'Create Account'
  });
};

const processUserRegistrationForm = async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const confirmPassword = String(req.body.confirmPassword || '');

    if (!name || !email || !password || !confirmPassword) {
      req.session.errorMessage = 'All fields are required.';
      return res.redirect('/register');
    }

    if (name.length > 100 || email.length > 100) {
      req.session.errorMessage = 'Name or email is too long.';
      return res.redirect('/register');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      req.session.errorMessage = 'Enter a valid email address.';
      return res.redirect('/register');
    }

    if (password.length < 8) {
      req.session.errorMessage =
        'Password must contain at least 8 characters.';
      return res.redirect('/register');
    }

    if (password !== confirmPassword) {
      req.session.errorMessage = 'Passwords do not match.';
      return res.redirect('/register');
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      req.session.errorMessage = 'Email is already registered.';
      return res.redirect('/register');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await createUser(name, email, passwordHash);

    req.session.successMessage =
      'Account created successfully. Please log in.';

    return res.redirect('/login');

  } catch (error) {
    if (error.code === '23505') {
      req.session.errorMessage = 'Email is already registered.';
      return res.redirect('/register');
    }

    next(error);
  }
};

// ========================================
// LOGIN
// ========================================

const showLoginForm = (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }

  res.render('login', {
    title: 'Login'
  });
};

const processLoginForm = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      req.session.errorMessage = 'Email and password are required.';
      return res.redirect('/login');
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      req.session.errorMessage = 'Invalid email or password.';
      return res.redirect('/login');
    }

    req.session.regenerate((error) => {
      if (error) {
        return next(error);
      }

      req.session.user = user;

      req.session.successMessage =
        `Welcome back, ${user.name}!`;

      req.session.save((saveError) => {
        if (saveError) {
          return next(saveError);
        }

        return res.redirect('/dashboard');
      });
    });

  } catch (error) {
    next(error);
  }
};

// ========================================
// LOGOUT
// ========================================

const processLogout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie('cse340.sid');
    return res.redirect('/login');
  });
};

// ========================================
// AUTHORIZATION MIDDLEWARE
// ========================================

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    req.session.errorMessage =
      'Please log in to access this page.';

    return res.redirect('/login');
  }

  next();
};

const requireRole = (roleName) => {
  return (req, res, next) => {
    if (!req.session.user) {
      req.session.errorMessage =
        'Please log in to access this page.';

      return res.redirect('/login');
    }

    if (req.session.user.role_name !== roleName) {
      req.session.errorMessage =
        'You do not have permission to access that page.';

      return res.redirect('/dashboard');
    }

    next();
  };
};

// ========================================
// DASHBOARD
// ========================================

const showDashboard = (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard',
    user: req.session.user
  });
};

// ========================================
// ADMIN - USER LIST
// ========================================

const showUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();

    res.render('users', {
      title: 'Registered Users',
      users
    });

  } catch (error) {
    next(error);
  }
};

export {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard,
  showUsers
};
