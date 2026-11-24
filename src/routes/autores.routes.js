const { Router } = require('express');
const c = require('../controllers/autores.controller');

// Envuelve los controladores async para que los errores lleguen al manejador global
const a = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const router = Router();

// Autores
router.get('/', a(c.listar));
router.get('/:id', a(c.obtener));
router.post('/', a(c.crear));
router.put('/:id', a(c.actualizar));
router.delete('/:id', a(c.eliminar));

// Libros embebidos en un autor
router.get('/:id/libros', a(c.listarLibros));
router.get('/:id/libros/:libroId', a(c.obtenerLibro));
router.post('/:id/libros', a(c.agregarLibro));
router.put('/:id/libros/:libroId', a(c.actualizarLibro));
router.delete('/:id/libros/:libroId', a(c.eliminarLibro));

module.exports = router;
