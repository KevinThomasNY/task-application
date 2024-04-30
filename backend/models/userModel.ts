import pool from "../db/connect"
import { RowDataPacket } from "mysql2";

export const checkUserExists = async (email: string): Promise<boolean> => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.execute<RowDataPacket[]>(query, [email]);
    return rows.length > 0;
}

export const createUser = async (email: string, password: string): Promise<void> => {
    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    await pool.execute(query, [email, password]);
}