require('dotenv').config(); 
const express = require('express');
const app = express();
const path = require('path');

// Configuración de EJS y archivos estáticos
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Ruta principal (Punto 3 de la rúbrica)
app.get('/', (req, res) => {
    res.render('index', { title: 'Inicio | Mi Proyecto Backend' });
});

// Configuración del puerto
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});
