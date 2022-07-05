const express = require("express");
const req = require("express/lib/request");
const fs = require("fs");
const fsPromises = require("fs/promises");

const app = express()
app.use(express.json())

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

const resolver = async () => {
  const archivoLeido = await fsPromises.readFile("text.txt", "utf8")
  return archivoLeido
}
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

app.get("/todos", async (request, response) => {
  const koders = await fsPromises.readFile("koders.json", "utf-8")
  const kodersJson = JSON.parse(koders) // que este parseado a json.
  response.json(kodersJson) // -> Content/Type = application/json
})

// QueryParams
app.get("/koders", async (request, response) => {
  // Destructuracion
  const { mod, gen } = request.query // Del objeto query sacamos los queryparams

  console.log("mod", mod)
  console.log("gen", gen)

  const koders = await fsPromises.readFile("koders.json", "utf-8")
  const kodersJson = JSON.parse(koders) // que este parseado a json.
  response.json(kodersJson.alumnos) // -> Content/Type = application/json
});


// Estructura de mi enpoints como tiene que ser si quiero que me regrese Abraham
// -> /todos
// -> /koders
// -> /koders/Abraham
// -> /koders/Bere
// -> /koders/Victor

// Syntaxis universal -> /recurso/identicador
// identificador = name

// Lo que manda el CLIENTE -> request
// Lo qiue manda el SERVIDOR -> response
// forEach, filter, map, reduce is not a function
// app.get("/koders/:nombre", async (request, response) => {

//   // Destructuracion
//   const { nombre } = request.params
//   const koders = await fsPromises.readFile("koders.json", "utf8")

//   const kodersJson = JSON.parse(koders)
//   const koderEncontrado = kodersJson.alumnos.filter((koder) => {
//     return koder.name.toLowerCase() === nombre.toLowerCase()
//   })

//   response.json(koderEncontrado)
// })

/**
 * -- Ejercicio --
 * Endpoints de GET. 
 * Ruta /koders/:name
 * queryparam -> modulo
 * pathparam -> name
 * 
 * que quiero que me regresen: El koder, o los koders.
 */

  // PATH params
 app.get("/koders/:id", async (request, response) => {

  // Destructuracion
  const { id } = request.params

  const koders = await fsPromises.readFile("koders.json", "utf8")

  const kodersJson = JSON.parse(koders)
  const koderEncontrado = kodersJson.alumnos.filter((koder) => {
    return koder.id === parseInt(id)
  })

  if(!koderEncontrado.length) {
    response.json("El koder no fue encontrado")
    return;
  }

  response.json(koderEncontrado[0])
})

app.listen(8080, () => {
  console.log("Ya estamos escuchando desde nuestro servidor express");
})

// Post
app.post("/koders", async (request, response) => {
  // Destructuracio

  // bd -> base de datos, data base

  const { name, modulo , gen, edad } = request.body // Recibimos datos
  const koders = await fsPromises.readFile("koders.json", "utf-8")
  const bd = JSON.parse(koders)
  const alumnos = bd.alumnos // Guarde arreglo alumnos

  const newAlumnos = [...alumnos] // Le hice un copy

  // Al arreglo alumno le hice el push con los datos que recibi del body
  newAlumnos.push({
    name: name,
    modulo: modulo,
    gen : gen,
    edad: edad
  })

  // Reemplaza en mi base de datos(koders.json) mi arreglo alumnos, por el nuevo
  bd.alumnos = newAlumnos

  // Escribi en koders.json mi base de datos nueva, con un salto de linea y 4 de indentacion
  await fsPromises.writeFile("koders.json", JSON.stringify(bd, "\n", 4))

  // Le regrese al usuario mis resultado
  response.json({
    name: name,
    modulo: modulo,
    gen : gen,
    edad: edad
  })
})