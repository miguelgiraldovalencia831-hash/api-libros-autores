const mongoose = require('mongoose');

// Letras (con tildes, diéresis y ñ), espacios, puntos, apóstrofes y guiones
const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]+$/;
const GENEROS = ['novela', 'cuento', 'poesía', 'ensayo', 'teatro', 'biografía', 'otro'];

// Modelo 2: Libro (subdocumento embebido dentro de Autor) -> relación 1:N
const libroSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título del libro es obligatorio'],
      trim: true,
      minlength: [1, 'El título no puede estar vacío'],
      maxlength: [150, 'El título no puede superar 150 caracteres'],
    },
    anioPublicacion: {
      type: Number,
      required: [true, 'El año de publicación es obligatorio'],
      min: [1000, 'El año de publicación debe ser mayor o igual a 1000'],
      max: [new Date().getFullYear(), 'El año de publicación no puede ser futuro'],
    },
    genero: {
      type: String,
      trim: true,
      lowercase: true,
      enum: { values: GENEROS, message: `El género debe ser uno de: ${GENEROS.join(', ')}` },
      default: 'otro',
    },
  },
  { timestamps: true }
);

// Modelo 1: Autor
const autorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del autor es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [80, 'El nombre no puede superar 80 caracteres'],
      match: [SOLO_LETRAS, 'El nombre solo puede contener letras (se aceptan tildes y ñ)'],
    },
    nacionalidad: {
      type: String,
      required: [true, 'La nacionalidad es obligatoria'],
      trim: true,
      minlength: [3, 'La nacionalidad debe tener al menos 3 caracteres'],
      match: [SOLO_LETRAS, 'La nacionalidad solo puede contener letras (se aceptan tildes y ñ)'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El email no tiene un formato válido'],
    },
    libros: [libroSchema],
  },
  { timestamps: true }
);

module.exports = {
  Autor: mongoose.model('Autor', autorSchema, 'autores'),
  Libro: mongoose.model('Libro', libroSchema),
  GENEROS,
};
