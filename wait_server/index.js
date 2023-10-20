// Esto es un servidor HTTP que escucha en el puerto 3000 básico con Node
// y que devuelve un mensaje de texto plano

import http from "node:http";
// Importamos el módulo http
// const http = require('node:http');
import quotes from "../priv/quotes.js";
import { getVanityName } from "../priv/utils.js";
import cluster from "node:cluster";

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  // Fork workers.
  for (let i = 0; i < 4; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Creamos el servidor
  const server = http.Server(async (req, res) => {
    console.log(`Petición recibida por proceso ${process.pid}`);

    // Esperamos 10 segundos

    let vanityName = "";
    const difficulty = req.url.split("/").pop();

    // Queremos hacer esperar al usuario entre 1 y 5 segundos para que no abuse
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 10_000 + 1_000)
    ).then(() => {
      // Esto corre en el event loop
      vanityName = getVanityName(difficulty);
    });

    res.writeHead(200, {
      "Content-Type": "application/json",
      charset: "utf-8",
    });
    res.end(
      JSON.stringify({
        ...quotes.random(),
        process: process.pid,
        vanityName,
      })
    );
    console.log(`Respuesta enviada por proceso ${process.pid}`);
  });
  server.listen(3000, () => {
    console.log(
      `Servidor escuchando en http://localhost:3000 por proceso ${process.pid}`
    );
  });
}
