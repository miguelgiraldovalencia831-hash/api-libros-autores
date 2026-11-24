const express = require('express');
const autoresRoutes = require('./routes/autores.routes');
const { trimBody, noEncontrado, manejarErrores } = require('./middlewares');

const app = express();

app.use(express.json());
app.use(trimBody);

// Responder siempre en JSON con UTF-8 para que tildes y ñ se vean bien
app.use((req, res, next) => {
  res.set('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.get('/', (req, res) => {
  res.json({ mensaje: 'API REST de Libros y Autores', autores: '/api/autores' });
});

app.use('/api/autores', autoresRoutes);

app.use(noEncontrado);
app.use(manejarErrores);

module.exports = app;
