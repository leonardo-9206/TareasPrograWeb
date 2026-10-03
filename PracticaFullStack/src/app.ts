//este archivo es ejecutado por la consola cuando arrancamos el servidor
import { Server } from "./server.ts";
import routes from "./routes/index.ts";
import dotenv from "dotenv";

// 1. Cargar las variables del archivo .env a la memoria
dotenv.config();

// 2. Obtener el puerto desde el .env y asegurarnos de convertirlo a número
const port = Number(process.env.PORT) || 3000;

// 3. Función principal de arranque (indicando tipo de retorno void)
function main(): void {
  // Instanciamos el Server pasándole el objeto de opciones { port, routes }
  const server = new Server({ port, routes });

  // Encendemos el servidor
  server.start();
}

// 4. Ejecutamos el punto de entrada
main();