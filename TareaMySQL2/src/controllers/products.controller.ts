import type { Request, Response } from 'express';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { db } from '../conf/dbConnection.ts';
import type { Product } from '../models/Product.ts';

export interface ProductRow extends RowDataPacket, Product {}

export class ProductController {
  // 1. GET /getAll o GET / - Obtiene todos los productos activos
  async getAll(_req: Request, res: Response) {
    try {
      const [rows] = await db.query<ProductRow[]>('SELECT * FROM products WHERE active = TRUE');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor al consultar productos' });
    }
  }

  // 2. GET /getById/:id o GET /:id - Obtiene producto por ID activo
  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'El ID debe ser un número entero positivo' });
    }
    try {
      const [rows] = await db.query<ProductRow[]>(
        'SELECT * FROM products WHERE id = ? AND active = TRUE',
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Producto no encontrado o inactivo' });
      }
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error al consultar producto por ID' });
    }
  }

  // 3. POST /create o POST / - Crea un nuevo producto
  async create(req: Request, res: Response) {
    const { name, price, stock, description, brand, img }: Product = req.body;
    if (!name || Number(price) <= 0 || stock === undefined || stock < 0 || !description) {
      return res.status(400).json({ message: 'Datos inválidos. El precio debe ser mayor a 0 y stock >= 0' });
    }

    try {
      const [result] = await db.query<ResultSetHeader>(
        'INSERT INTO products (name, price, stock, description, brand, img, active) VALUES (?, ?, ?, ?, ?, ?, TRUE)',
        [name, price, stock, description, brand || null, img || null]
      );
      res.status(201).json({ message: 'Producto creado exitosamente', id: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear producto' });
    }
  }

  // 4. PUT /update/:id o PUT /:id - Actualiza producto completo
  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { name, price, stock, description, brand, img }: Product = req.body;
    if (isNaN(id) || id <= 0 || Number(price) <= 0 || stock === undefined || stock < 0) {
      return res.status(400).json({ message: 'ID, precio o stock inválidos' });
    }
    try {
      const [result] = await db.query<ResultSetHeader>(
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

  // 5. DELETE /delete/:id o DELETE /:id - Baja lógica de producto
  async deleteProduct(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    try {
      const [result] = await db.query<ResultSetHeader>(
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

  // 6. PATCH /change-price/:id o PATCH /:id/price - Modifica únicamente el precio
  async changePrice(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { price } = req.body;
    if (isNaN(id) || id <= 0 || Number(price) <= 0) {
      return res.status(400).json({ message: 'ID o precio inválido. Debe ser mayor a 0' });
    }
    try {
      const [result] = await db.query<ResultSetHeader>(
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