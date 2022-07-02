const express = require("express");

const app = express()

app.get("/hola", (request, response) => {
  response.write("Holaaa desde mi endpoint /hola")
  response.end()
})

app.post("/adios", (request, response) => {
  response.send("Estamos haciendo un post desde aqui")
})

/**
 * Ejercicio
 * Tienen que hacer un endpoint, donde lea un archivo de texto.
 * Me tiene que regresar ocmo respuesta el contenido del archivo.
 * 
 * Se puede hacer con callbacks, promises -> then/catch, -> async/await
 */

app.listen(8080, () => {
  console.log("Ya estamos escuchando desde nuestro servidor express");
})