const express = require("express");
const fs = require("fs");
const fsPromises = require("fs/promises");

const app = express()
app.use(express.json()) // body -> json

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

// inmutables -> no se piueden modificar
// aws -> S3 bucket

// spread operator {...} vs object assign -> Object.assign
// copia -> me hace un objeto 
// object assign -> volver a asignar

app.put("/koders/:id", async (request, response) => {
  const koders = await fsPromises.readFile("koders.json", "utf-8")
  const bd = JSON.parse(koders)

  // Destructuracion
  const { id } = request.params // -> esto es un string
  const { name, gen, modulo, edad } = request.body

  const alumnos = bd.alumnos

  // Encontrar el koder que queremos modificar
  const koderIndex = alumnos.findIndex(alumno => parseInt(id) === alumno.id)

  // Cambiar el objeto que esta en ese indice
  alumnos[koderIndex] = {
    id: alumnos[koderIndex].id,
    name,
    gen,
    modulo,
    edad
  }
  bd.alumnos = alumnos
  await fsPromises.writeFile("koders.json", JSON.stringify(bd, "\n", 2))

  response.json(alumnos[koderIndex])
})

app.patch("/koders/:id", async (request, response) => {
  
  const koders = await fsPromises.readFile("koders.json", "utf-8")
  const bd = JSON.parse(koders)

  // Destructuracion
  const { id } = request.params

  // Me trae el index
  const koderIndex = bd.alumnos.findIndex(alumno => parseInt(id) === alumno.id)

  // Koder encontrado
  const koderEncontrado = bd.alumnos[koderIndex]

   for(const propiedad in request.body) {
    console.log(`${propiedad}: ${request.body[propiedad]}`)
    koderEncontrado[propiedad] = request.body[propiedad]
  }

  await fsPromises.writeFile("koders.json", JSON.stringify(bd, "\n", 2))

  response.json(koderEncontrado)
})

app.delete("/koders/:id", async (request, response) => {

  // Params
  const { id } = request.params
  

  const koders = await fsPromises.readFile("koders.json", "utf-8")
  const bd = JSON.parse(koders)

  const koderEncontrado = bd.alumnos.filter(koder => {
    return koder.id === parseInt(id)
  })

  if(!koderEncontrado.length) {
    response.status(404) // No se encontro el koder
    response.json({
      "message": "El koder solicitdado no se encontro"
    })
    return;
  }

  const kodersQueSeQuedan = bd.alumnos.filter((koder) => {
    if(koder.id !== parseInt(id)) {
      return koder
    }
  })


  // Modificacion
  bd.alumnos = kodersQueSeQuedan

  console.log("bd.alumnos", bd.alumnos)

  await fsPromises.writeFile("koders.json", JSON.stringify(bd, "\n", 2))

  response.status(202) //not found
  response.json("Se elimino exitosamente")

})
/**
 * Ejercicio
 * Hacer un endpoint de PATCH -> ruta -> /koders/:id
 * 
 * Se van a actualizar las propiedades que le mande
 * 
 * Ej:
 * --Tenemos: 
 * {
 *  id: 4,
 *  name: "Lesly",
 *  gen: "19Js",
 *  edad: 20,
 *  modulo: "Backend",
 * }
 * 
 * -- Body
 * {
 *  name: "Marco"
 *  gen: "20Js",
 * }
 * 
 * Se modifique solamente name y gen.
 * 
 * -- Output
 * {
 *   id: 4,
 *   name: "Marco"
 *   gen: "20Js",
 *   modulo: "Backend",
*    edad: 20
 * }
 * 
 * [propiedad]
 * 
 * objeto[propiedad]
 * 
 * forEach, map -> arreglos
 * ciclo -> propiedad
 * 
 * tip: hasOwnProperty -> https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
 * tip: for in para ciclos de objetos
 * 
 * 
 */

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