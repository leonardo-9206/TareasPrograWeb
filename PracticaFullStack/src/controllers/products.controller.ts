//este archivo tiene los metodos de lo que se debe de hacer cuando llega un req
//creamos el objeto ProductController y sus metodos, y lo ponemos como export porque
//lo vamos a importar en el archivo de las rutas para asignar una ruta a cada metodo para que
//se sepa que hacer
//base de datos simulada en memoria (array)
//AHORA SIENDO TYPESCRIPT
//importamos los tipos de datos request y response de express

import type{ Request, Response} from 'express';

const productos = [
    { id: 1, nombre: "Galletas marias 170g", precio: 16.50},
    { id: 2, nombre: "Refresco Coca Cola 600ml", precio: 19.00},
    { id: 3, nombre: "Aceite 123 1L", precio: 42.00}
];

export class ProductController{
    //metodo para obtener todos los productos (tipando req y res)
    getProducts(_req: Request, res: Response){
        res.json(productos);
    }

    //metodo para crear un nuevo producto (POST /api/products)
    createProduct(req: Request, res: Response){
        const {nombre, precio} = req.body; //desestructuracion JS
        //validar que manden los datos
        if(!nombre || !precio){
            return res.status(400).json({error: "El nombre y el precio son obligatorios"});
        }
        //creamos producto con ID autoincremental
        const nuevoProducto = {
            id: productos.length + 1,
            nombre: nombre,
            precio: Number(precio)
        };
        //lo guardamos en el arreglo
        productos.push(nuevoProducto);
        //respondemos con status 201 (creado exitosamente)
        res.status(201).json({
            mensaje: "Producto creado con exito",
            producto: nuevoProducto
        });
    }

    //metodo para actualizar un producto por su ID (PUT /api/products/:id)
    updateProduct(req: Request, res: Response){
        //usamos + para convertir a numero y ! para asegurarnos de que no sea null
        const id = +req.params.id!;
        const name = req.body.name;
        const product = productos.find(p => p.id === id);
        //buscamos si existe el producto usando .find()
        const producto = productos.find(p => p.id === id);
        if(!producto){
            return res.status(404).json({error: "Producto no encontrado"});
        }
        if(!name){
            res.status(400).json({message: "necesito que me des el nombre del producto"})
            return;
        }
        producto.nombre = name;
        res.status(200).json({message: "producto actualizado"});
    }
}