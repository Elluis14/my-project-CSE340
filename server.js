/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path"); // <--- ESTA LÍNEA ARREGLA EL ERROR
require("dotenv").config();
const app = express();

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); 

/* ***********************
 * Static Assets (CSS, Images)
 * ESTO DEBE IR ANTES DE LAS RUTAS
 *************************/
app.use(express.static(path.join(__dirname, "public")));

/* ***********************
 * Index Route
 *************************/
app.get("/", function(req, res) {
  res.render("index", { title: "Home" });
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`app listening on http://${host}:${port}`);
});
