import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

//cargar variables del archivo .env
dotenv.config();

//crear el pool de conexiones a mysql
//hacemos que lea desde el archivo .env para no dejar credenciales expuestos en el codigo
export const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pos',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});