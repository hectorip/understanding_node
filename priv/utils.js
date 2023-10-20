import { createHash } from "node:crypto";

function getVanityName(name) {
  /*
    Usando sha256 para obtener un vanity name
    Esto está basado en cómo funcionan los "vanity domains" de onion
    Puedes ver aquí la idea: 
  */
  const hash = createHash("sha256");
  let vanityName = hash
    .copy()
    .update(Math.random().toString())
    .digest("base64");
  while (!vanityName.startsWith(name)) {
    vanityName = hash.copy().update(Math.random().toString()).digest("base64");
  }
  return vanityName;
}

export { getVanityName };
