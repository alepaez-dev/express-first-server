const express = require("express");
const fs = require("fs");
const fsPromises = require("fs/promises");

const app = express()

app.get("/hola", (request, response) => {
  response.write("Holaaa desde mi endpoint /hola")
  response.end()
})

app.post("/adios", (request, response) => {
  response.send("Estamos haciendo un post desde aqui")
})

// Callbacks
app.get("/callback", (request, response) => {
  fs.readFile("texto.txt", "utf8", (err, data) => {
    if(err) {
      response.send("Hubo un error")
      return
    }
    response.send(data)
  })
})

// Promises
app.get("/promises", (request, response) => {
  fsPromises.readFile("texto.txt", "utf8")
  .then((archivoALeer) => {
    response.send(archivoALeer)
  })
  .catch((err) => {
    response.send("Hubo un error")
  })
})

// Async/Await
// --> async/await -> try catch
app.get("/async", async (request, response) => {
  try {
    const archivoLeido = await fsPromises.readFile("text.txt", "utf8")
    response.send(archivoLeido)
  } catch(err) {
    console.log("err", err)
    response.send("Hubo un error.")
  }
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