// Esto es un servidor HTTP que escucha en el puerto 3000 básico con Node
// y que devuelve un mensaje de texto plano

import http from "node:http";
// Importamos el módulo http
// const http = require('node:http');
import quotes from "../priv/quotes.js";
import cluster from "node:cluster";
import { createHash } from "node:crypto";

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
    await new Promise((resolve) => setTimeout(resolve, 5_000));

    const difficulty = req.url.split("/").pop();
    console.log(`URI: ${difficulty}`);

    res.writeHead(200, {
      "Content-Type": "application/json",
      charset: "utf-8",
    });
    res.end(
      JSON.stringify({
        ...quotes.random(),
        process: process.pid,
        vanityName: getVanityName(difficulty),
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
