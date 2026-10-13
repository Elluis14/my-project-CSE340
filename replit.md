# CSE340 Backend Project

## Overview
A Node.js/Express web application using EJS templating engine. This is a backend development class project (CSE340).

## Architecture
- **Runtime**: Node.js 20
- **Framework**: Express 5
- **Template Engine**: EJS 5
- **Package Manager**: pnpm
- **Port**: 5000 (0.0.0.0)

## Project Structure
- `server.js` — Main Express server entry point
- `src/views/` — EJS templates
  - `home.ejs` — Home page
  - `partials/` — Shared header and footer
- `src/routes.js` — Routes for organizations, projects, and categories
- `src/controllers/` — Page rendering and form validation
- `src/models/` — PostgreSQL queries
- `src/setup.sql` — Optional schema and starter data for a new database
- `public/` — Static assets
  - `css/styles.css` — Global styles

## Running the App
```bash
pnpm install --frozen-lockfile
pnpm start
```
Use the **Run** button to start the configured `Start application` workflow (`node server.js`).
The server defaults to port 5000, binding to 0.0.0.0; `PORT` can override it.

## Configuration
- `DB_URL` (Secret): the user's existing external PostgreSQL connection string. Keep this external database; do not replace it with Replit PostgreSQL.
- `SESSION_SECRET` (Secret): required session signing secret.
- `NODE_ENV`: defaults to `production`; set to `development` to enable request logging.
- `ENABLE_SQL_LOGGING=true`: optional query logging in development only.

The application checks the database connection before listening. It does not run schema migrations or seed data on startup. Do not run `src/setup.sql` against an existing database without approval; it creates tables and inserts sample records.
Form parsers and session middleware run before routes. The server trusts one reverse proxy so secure cookies work behind Replit HTTPS.

## Dependencies
- `express` — Web framework
- `ejs` — Templating engine
- `dotenv` — Environment variable management
- `pg` — External PostgreSQL access
- `express-session` — Session middleware
- `express-validator` — Form validation
