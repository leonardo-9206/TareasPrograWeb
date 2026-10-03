import type {Request, Response} from 'express';
import {db} from '../conf/dbConnection.ts';

export class ProductController{
    //definimos las 6 operaciones
    //GET /getAll que nos da todos los productos activos
    async getAll(_req: Request, res: Response){
        try{
            //solo productos donde esten activos
            const [rows] = await db.query('SELECT * FROM products WHERE active = TRUE');
            res.json(rows);
        }catch(error){
            res.status(500).json({message: 'Error interno del servidor al consultar productos'});
        }
    }

    // GET /getById/:id que nos da un producto por ID siempre y cuando este activo
    async getById(req: Request, res: Response){
        const id= Number(req.params.id);
        //validamos que el ID sea un entero positivo
        if(isNaN(id) || id <= 0){
            return res.status(400).json({message: 'El ID debe ser un numero entero positivo'});
        }
        try{
            //consulta parametrizada con ?
            const [rows]: any = await db.query('SELECT * FROM products WHERE id = ? AND active = TRUE', [id]);
            if(rows.length === 0){
                return res.status(404).json({message: 'Producto no encontrado o inactivo'});
            }
            res.json(rows[0]);
        }catch(error){
            res.status(500).json({message: 'Error al consultar producto por ID'});
        }
    }
    //POST /create que crea producto nuevo
    async create(req:Request, res: Response){
        const{name,price,stock,description,brand,img} = req.body;
        //validamos que el precio sea mayor a 0
        if(!name || Number(price) <=0 || stock === undefined || !description){
            return res.status(400).json({message: 'Datos invalidos. El precio debe ser mayor a 0'});
        }
        
        try{
            const[result]: any = await db.query(
                'INSERT INTO products (name,price,stock,description,brand,img,active) VALUES (?,?,?,?,?,?,TRUE)',
                [name,price,stock,description,brand || null, img || null]
            );
            res.status(201).json({message: 'Producto creado exitosamente', id: result.insertId});
        }catch(error){
            res.status(500).json({message: 'Error al crear producto'});
        }
    }

    // 4. PUT /update/:id nos actualiza todo un producto completo
    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        const { name, price, stock, description, brand, img } = req.body;
        if (isNaN(id) || id <= 0 || Number(price) <= 0) {
        return res.status(400).json({ message: 'ID o precio inválido' });
        }
        try {
        const [result]: any = await db.query(
            'UPDATE products SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? WHERE id = ? AND active = TRUE',
            [name, price, stock, description, brand || null, img || null, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado o inactivo' });
        }
        res.json({ message: 'Producto actualizado exitosamente' });
        } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto' });
        }
    }

  // 5. DELETE /delete/:id hacemos baja logica
  async deleteProduct(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    try {
      // ¡Baja Lógica! Hacemos UPDATE de active = FALSE en lugar de DELETE físico
      const [result]: any = await db.query(
        'UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE',
        [id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Producto no encontrado o ya estaba inactivo' });
      }
      res.json({ message: 'Producto dado de baja lógicamente con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al dar de baja producto' });
    }
  }

  // 6. PATCH /change-price/:id nos modifica exclusivamente el precio
  async changePrice(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { price } = req.body;
    if (isNaN(id) || id <= 0 || Number(price) <= 0) {
      return res.status(400).json({ message: 'ID o precio inválido. Debe ser mayor a 0' });
    }
    try {
      const [result]: any = await db.query(
        'UPDATE products SET price = ? WHERE id = ? AND active = TRUE',
        [price, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Producto no encontrado o inactivo' });
      }
      res.json({ message: 'Precio actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al cambiar precio del producto' });
    }
  }
}