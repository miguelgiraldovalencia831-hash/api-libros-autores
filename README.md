# API REST de Libros y Autores

API REST en JSON hecha con **Node.js + Express + MongoDB (Mongoose)**.
Tiene 2 modelos con una relación **1:N**: un **Autor** tiene muchos **Libros**, que se guardan embebidos dentro del autor (`libros: []`).

**Autor:** Miguel Giraldo

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) corriendo en local (`mongodb://127.0.0.1:27017`)

## Cómo correrlo

```bash
# 1. Clonar el repositorio
git clone https://github.com/miguelgiraldovalencia831-hash/api-libros-autores.git
cd api-libros-autores

# 2. Instalar dependencias
npm install

# 3. Verificar que MongoDB esté encendido (en Windows queda como servicio "MongoDB")
#    Si no está corriendo:  net start MongoDB

# 4. Iniciar la API
npm start
```

La API queda en `http://localhost:3000` y usa la base de datos `libros_autores`.

Variables de entorno opcionales:

| Variable    | Valor por defecto                              |
|-------------|------------------------------------------------|
| `PORT`      | `3000`                                         |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/libros_autores`     |

## Modelos

### Autor (colección `autores`)

| Campo          | Tipo     | Reglas                                                        |
|----------------|----------|---------------------------------------------------------------|
| `nombre`       | String   | Obligatorio, 2 a 80 caracteres, solo letras (acepta tildes y ñ) |
| `nacionalidad` | String   | Obligatorio, mínimo 3 caracteres, solo letras (acepta tildes y ñ) |
| `email`        | String   | Opcional, formato de email válido, único                      |
| `libros`       | [Libro]  | Arreglo de libros embebidos (relación 1:N)                    |

### Libro (embebido en Autor)

| Campo             | Tipo   | Reglas                                                              |
|-------------------|--------|---------------------------------------------------------------------|
| `titulo`          | String | Obligatorio, 1 a 150 caracteres                                     |
| `anioPublicacion` | Number | Obligatorio, entre 1000 y el año actual                             |
| `genero`          | String | `novela`, `cuento`, `poesía`, `ensayo`, `teatro`, `biografía`, `otro` (por defecto `otro`) |

## Validaciones

1. **Campos obligatorios:** `nombre`, `nacionalidad`, `titulo` y `anioPublicacion`.
2. **Longitud mínima y máxima** de los textos (`nombre` 2–80, `titulo` 1–150, etc.).
3. **Formato:** el nombre y la nacionalidad solo aceptan letras (incluye **tildes y ñ**), el email debe ser válido.
4. **Rango numérico:** `anioPublicacion` entre 1000 y el año actual.
5. **Valores permitidos (enum)** para `genero`.
6. **Ids válidos:** si el id no es un ObjectId válido responde `400`, si no existe responde `404`.

Además se hace **trim** de todos los textos que llegan en el body (`"  Gabriel  "` se guarda como `"Gabriel"`), tanto con un middleware como en el esquema.

Cuando una validación falla la respuesta es `400` con el detalle:

```json
{
  "error": "Error de validación",
  "errores": [
    { "campo": "nombre", "mensaje": "El nombre del autor es obligatorio" }
  ]
}
```

## Tabla resumen de endpoints

Base: `http://localhost:3000/api`

| Método | Endpoint                              | Descripción                                   | Respuesta OK |
|--------|---------------------------------------|-----------------------------------------------|--------------|
| GET    | `/autores`                            | Listar todos los autores                      | 200          |
| GET    | `/autores/:id`                        | Obtener un autor por id                       | 200          |
| POST   | `/autores`                            | Crear un autor                                | 201          |
| PUT    | `/autores/:id`                        | Actualizar un autor                           | 200          |
| DELETE | `/autores/:id`                        | Eliminar un autor                             | 200          |
| GET    | `/autores/:id/libros`                 | Listar los libros de un autor                 | 200          |
| GET    | `/autores/:id/libros/:libroId`        | Obtener un libro de un autor                  | 200          |
| **POST** | **`/autores/:id/libros`**           | **Agregar 1 libro embebido a un autor**       | 201          |
| PUT    | `/autores/:id/libros/:libroId`        | Actualizar un libro de un autor               | 200          |
| DELETE | `/autores/:id/libros/:libroId`        | Eliminar un libro de un autor                 | 200          |

## Probar todo con curl

Los ejemplos usan sintaxis de **bash** (Git Bash, Linux o macOS).
Reemplaza `ID_AUTOR` y `ID_LIBRO` por los `_id` que devuelve la API.

### 1. Crear un autor (con tildes y ñ, y espacios de más para ver el trim)

```bash
curl -X POST http://localhost:3000/api/autores \
  -H "Content-Type: application/json" \
  -d '{"nombre": "   Gabriel García Márquez  ", "nacionalidad": "Colombiana", "email": "gabo@ejemplo.com"}'
```

### 2. Crear otro autor con ñ

```bash
curl -X POST http://localhost:3000/api/autores \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Ana María Muñoz", "nacionalidad": "Española"}'
```

### 3. Listar autores

```bash
curl http://localhost:3000/api/autores
```

### 4. Obtener un autor

```bash
curl http://localhost:3000/api/autores/ID_AUTOR
```

### 5. Actualizar un autor

```bash
curl -X PUT http://localhost:3000/api/autores/ID_AUTOR \
  -H "Content-Type: application/json" \
  -d '{"nacionalidad": "Colombiano"}'
```

### 6. Agregar un libro embebido al autor

```bash
curl -X POST http://localhost:3000/api/autores/ID_AUTOR/libros \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Cien años de soledad", "anioPublicacion": 1967, "genero": "novela"}'
```

### 7. Listar los libros del autor

```bash
curl http://localhost:3000/api/autores/ID_AUTOR/libros
```

### 8. Obtener un libro

```bash
curl http://localhost:3000/api/autores/ID_AUTOR/libros/ID_LIBRO
```

### 9. Actualizar un libro

```bash
curl -X PUT http://localhost:3000/api/autores/ID_AUTOR/libros/ID_LIBRO \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Cien años de soledad (edición conmemorativa)"}'
```

### 10. Eliminar un libro

```bash
curl -X DELETE http://localhost:3000/api/autores/ID_AUTOR/libros/ID_LIBRO
```

### 11. Eliminar un autor

```bash
curl -X DELETE http://localhost:3000/api/autores/ID_AUTOR
```

### Probar las validaciones

```bash
# Nombre vacío -> 400 (obligatorio)
curl -X POST http://localhost:3000/api/autores \
  -H "Content-Type: application/json" \
  -d '{"nombre": "   ", "nacionalidad": "Colombiana"}'

# Nombre con números -> 400 (formato)
curl -X POST http://localhost:3000/api/autores \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Autor123", "nacionalidad": "Colombiana"}'

# Año en el futuro y género inválido -> 400 (rango y enum)
curl -X POST http://localhost:3000/api/autores/ID_AUTOR/libros \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Libro futuro", "anioPublicacion": 3000, "genero": "terror"}'

# Id inválido -> 400
curl http://localhost:3000/api/autores/123

# Id que no existe -> 404
curl http://localhost:3000/api/autores/000000000000000000000000
```

> **En Windows (PowerShell o Git Bash):** la consola puede enviar las tildes y la ñ con otra codificación
> (no UTF-8) y la API las rechazaría. Para que lleguen bien, guarda el JSON en un archivo UTF-8 y envíalo
> con `--data-binary` (en PowerShell usa `curl.exe` en vez de `curl`):
>
> ```powershell
> '{"nombre": "Ana María Muñoz", "nacionalidad": "Española"}' | Out-File -Encoding utf8NoBOM autor.json
> curl.exe -X POST http://localhost:3000/api/autores -H "Content-Type: application/json" --data-binary "@autor.json"
> ```

## Estructura del proyecto

```
api-libros-autores/
├── src/
│   ├── controllers/autores.controller.js   # Lógica del CRUD de autores y libros
│   ├── models/Autor.js                     # Esquemas Autor y Libro (embebido)
│   ├── routes/autores.routes.js            # Rutas
│   ├── middlewares.js                      # Trim, 404 y manejo de errores
│   ├── app.js                              # Configuración de Express
│   └── index.js                            # Conexión a MongoDB y arranque
├── package.json
└── README.md
```
