# Entendiendo NodeJS

En este ejercicio puedes ver tres versiones de un servidor http simple.

En la carpeta `http_server` puedes ver la versión más simple, que levanta un servidor escuchando en el puerto 3000, y te devuelve un json con una cita aleatoria de programación, con un campo extra llamado vanityName que es una cadena de texto semi-aleatoria si le mandas algo en el path, por ejemplo: `http://localhost:3000/abc` te devuelve un json con un campo vanityName que comienza con `abc`.

La función `getVanityName` del módulo `utils.js` simplemente devuelve una cadena de texto que representa un hash de SHA256 codificado en base64, que comienza con las letras
que se le pasa como parámetro. La idea de la función es *simular una función que tarda mucho en devolver un resultado, con la customización de dificultad, mientras más larga sea la cadena que le mandas más va a tardar.

Si le mandas como path una cadena compleja, el servidor va a tardar bastante tiempo en responder, bloqueando las respuestas a otros clientes.

En la carpeta `cluster_server` tenemos la misma funcionalidad, pero usando el módulo `cluster` de NodeJS, que permite levantar varios procesos que escuchan en el mismo puerto, y el balanceo de carga lo hace NodeJS automáticamente.
Si lo corres podrás ver que el servidor puede atender varias peticiones al mismo tiempo aunque una de ellas sea muy pesada.

## Ejercicio

El ejercicio consiste en ver lo que pasa si corres la tercera carpeta: `waiting_server`, que en agrega espera al cómputo del vanity name.

Córrelo y observa el comportamiento cuando haces peticiones concurrentes, es decir, cuando haces varias peticiones al mismo tiempo. Puedes probar con `curl` o con un navegador. En la clase yo usé: https://httpie.io/.

Nota, que este ejemplo también está usando el módulo cluster, por lo que tenemos varios procesos atendiendo las peticiones, además, estamos metiendo al eventloop un trabajo que tarda mucho en terminar, por lo que el servidor se va a bloquear.

## Preguntas

- ¿Modifica algo el comportamiento del cluster que movamos cosas al event loop?
- ¿Hay un event loop principal que comunique todos los procesos?
- Investiga otras maneras de hacer trabajo concurrente con NodeJS, por ejemplo usando `worker_threads` o `child_process` y qué ventajas tendrían sobre el uso de `cluster`.
