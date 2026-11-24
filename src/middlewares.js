const mongoose = require('mongoose');

// Aplica trim a todos los strings del body (también dentro de objetos y arreglos)
function trimDeep(valor) {
  if (typeof valor === 'string') return valor.trim();
  if (Array.isArray(valor)) return valor.map(trimDeep);
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, trimDeep(v)]));
  }
  return valor;
}

exports.trimBody = (req, res, next) => {
  if (req.body) req.body = trimDeep(req.body);
  next();
};

exports.noEncontrado = (req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
exports.manejarErrores = (err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    const errores = Object.values(err.errors).map((e) => ({ campo: e.path, mensaje: e.message }));
    return res.status(400).json({ error: 'Error de validación', errores });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: `Valor inválido para el campo ${err.path}` });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Ya existe un registro con ese valor', campo: Object.keys(err.keyValue) });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
};
