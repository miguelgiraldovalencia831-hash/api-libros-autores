const mongoose = require('mongoose');
const { Autor } = require('../models/Autor');

const CAMPOS_AUTOR = ['nombre', 'nacionalidad', 'email'];
const CAMPOS_LIBRO = ['titulo', 'anioPublicacion', 'genero'];

const elegir = (obj, campos) =>
  Object.fromEntries(campos.filter((c) => obj[c] !== undefined).map((c) => [c, obj[c]]));

const idValido = (id) => mongoose.Types.ObjectId.isValid(id);

async function buscarAutor(req, res) {
  if (!idValido(req.params.id)) {
    res.status(400).json({ error: 'El id del autor no es válido' });
    return null;
  }
  const autor = await Autor.findById(req.params.id);
  if (!autor) {
    res.status(404).json({ error: 'Autor no encontrado' });
    return null;
  }
  return autor;
}

function buscarLibro(autor, req, res) {
  if (!idValido(req.params.libroId)) {
    res.status(400).json({ error: 'El id del libro no es válido' });
    return null;
  }
  const libro = autor.libros.id(req.params.libroId);
  if (!libro) {
    res.status(404).json({ error: 'Libro no encontrado en este autor' });
    return null;
  }
  return libro;
}

// ---------- CRUD Autores ----------

exports.listar = async (req, res) => {
  const autores = await Autor.find().sort({ createdAt: -1 });
  res.json(autores);
};

exports.obtener = async (req, res) => {
  const autor = await buscarAutor(req, res);
  if (autor) res.json(autor);
};

exports.crear = async (req, res) => {
  const datos = elegir(req.body, CAMPOS_AUTOR);
  if (Array.isArray(req.body.libros)) datos.libros = req.body.libros.map((l) => elegir(l, CAMPOS_LIBRO));
  const autor = await Autor.create(datos);
  res.status(201).json(autor);
};

exports.actualizar = async (req, res) => {
  const autor = await buscarAutor(req, res);
  if (!autor) return;
  autor.set(elegir(req.body, CAMPOS_AUTOR));
  await autor.save();
  res.json(autor);
};

exports.eliminar = async (req, res) => {
  const autor = await buscarAutor(req, res);
  if (!autor) return;
  await autor.deleteOne();
  res.json({ mensaje: 'Autor eliminado', autor });
};

// ---------- Libros embebidos (relación 1:N) ----------

exports.listarLibros = async (req, res) => {
  const autor = await buscarAutor(req, res);
  if (autor) res.json(autor.libros);
};

exports.obtenerLibro = async (req, res) => {
  const autor = await buscarAutor(req, res);
  if (!autor) return;
  const libro = buscarLibro(autor, req, res);
  if (libro) res.json(libro);
};

// Endpoint para agregar 1 registro embebido: POST /api/autores/:id/libros
exports.agregarLibro = async (req, res) => {
  const autor = await buscarAutor(req, res);
  if (!autor) return;
  autor.libros.push(elegir(req.body, CAMPOS_LIBRO));
  await autor.save();
  res.status(201).json(autor);
};

exports.actualizarLibro = async (req, res) => {
  const autor = await buscarAutor(req, res);
  if (!autor) return;
  const libro = buscarLibro(autor, req, res);
  if (!libro) return;
  libro.set(elegir(req.body, CAMPOS_LIBRO));
  await autor.save();
  res.json(libro);
};

exports.eliminarLibro = async (req, res) => {
  const autor = await buscarAutor(req, res);
  if (!autor) return;
  const libro = buscarLibro(autor, req, res);
  if (!libro) return;
  libro.deleteOne();
  await autor.save();
  res.json({ mensaje: 'Libro eliminado', autor });
};
