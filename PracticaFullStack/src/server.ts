//este archivo configura la instancia del servidor express, cors, puerto, rutas api, configurar para json
import express, {Express, Router} from 'express';
import cors from 'cors';

//tipo de dato personalizado para las opciones del constructor
type ServerOptions ={
    port: number;
    routes: Router;
};

export class Server{
    //propiedades privadas y de solo lectura
    private readonly port: number;
    private readonly app: Express;
    private readonly routes: Router;

    constructor(options: ServerOptions){
        this.app = express();
        this.port = options.port;
        this.routes = options.routes;
    }

    public start = (): void =>{
        //permisos CORS
        this.app.use(cors());
        //lectura JSON
        this.app.use(express.json());
        //montamos las rutas con versionamiento /api
        this.app.use('/api', this.routes);
        //iniciamos escucha
        this.app.listen(this.port, () => {
            console.log("Servidor TypeScript ejecutandose en http://localhost:" + this.port);
        });
    };
}

