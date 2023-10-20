// Esto es un servidor HTTP que escucha en el puerto 3000 básico con Node
// y que devuelve un mensaje de texto plano

import http from "node:http";
// Importamos el módulo http
// const http = require('node:http');
import quotes from "../priv/quotes.js";
import { getVanityName } from "../priv/utils.js";
Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

// Creamos el servidor
const server = http.createServer(async (req, res) => {
  // Escribimos la cabecera

  // Operación bloqueante
  // await new Promise((resolve) => setTimeout(resolve, 10_000));
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
  // Escribimos el mensaje
});

// Ponemos el servidor a escuchar en el puerto 3000

server.listen(3000, () => {
  console.log("Servidor escuchando en http://localhost:3000");
});
