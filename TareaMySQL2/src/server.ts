import express, { Express, Router } from 'express';
import cors from 'cors';

type ServerOptions = {
  port: number;
  routes: Router;
};

export class Server {
  private readonly port: number;
  private readonly app: Express;
  private readonly routes: Router;

  constructor(options: ServerOptions) {
    this.app = express();
    this.port = options.port;
    this.routes = options.routes;
  }

  public start = (): void => {
    //habilitar permisos CORS
    this.app.use(cors());

    //habilitar lectura de JSON en peticiones POST/PUT/PATCH
    this.app.use(express.json());

    //montar las rutas bajo el prefijo /api/v1 
    this.app.use('/api/v1', this.routes);

    //iniciar escucha en el puerto
    this.app.listen(this.port, () => {
      console.log(`Servidor MySQL2 TypeScript escuchando en http://localhost:${this.port}`);
    });
  };
}