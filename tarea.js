/**
 * Crear endpoints donde tengamos un path param con el id para elegir a 
 * que koder le vamos a agregar una nueva key con sus hobbies
 * 
 * 
 * Ruta -> POST -> /koders/:id -> 1
 * 
 * Body : {
 *  hobby : "tenis"
 * }
 * 
 * Tenemos:
 * {
    "id": 1,
    "name": "Abraham",
    "gen": "19Js",
    "modulo": "Backend",
    "edad": 20
  },

  Que espero: 
  {
    "id": 1,
    "name": "Abraham",
    "gen": "19Js",
    "modulo": "Backend",
    "edad": 20
    "hobbies": ["tenis", "futbol", ""]
  },
 */