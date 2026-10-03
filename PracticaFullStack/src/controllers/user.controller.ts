import type { Request, Response } from "express";

// Base de datos simulada de Usuarios
const users = [
  {
    id: 1,
    name: "Leonardo",
    lastName: "Pérez",
    email: "leo@uaa.mx",
    role: "ADMIN",
    password: "PasswordSecreta123!",
    profileImg: "https://avatar.com/leo.png"
  },
  {
    id: 2,
    name: "Cajero",
    lastName: "Principal",
    email: "cajero01@pos.com",
    role: "CASHIER",
    password: "CajeroPassword456!",
    profileImg: "https://avatar.com/cajero.png"
  }
];

export class UserController {

  // Método para obtener un usuario por su ID
  getUserById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);

    // 1. Si el usuario no existe en la BD
    if (!user) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    // 2. 🔒 TRUCO DE SEGURIDAD DEL PROFE: Operador Spread ({ ...user })
    //... sirve para tomar el objeto original y copiar todas sus propiedades, ya nomas en la contraseña la ponemos como vacia
    // Retorna una copia de todos los datos del usuario pero limpia la contraseña
    res.json({ ...user, password: "" });
  }
}