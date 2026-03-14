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
- `views/` — EJS templates
  - `index.ejs` — Home page
  - `partials/` — Shared partials (head, header, footer)
- `public/` — Static assets
  - `css/style.css` — Global styles

## Running the App
```bash
node server.js
```
The server starts on port 5000, binding to 0.0.0.0.

## Dependencies
- `express` — Web framework
- `ejs` — Templating engine
- `dotenv` — Environment variable management
