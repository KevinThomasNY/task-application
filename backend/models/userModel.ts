import pool from "../db/connect";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import {
  UserCreationResponse,
  fetchUserByEmailResponse,
  fetchUserByIdResponse,
} from "../types/userTypes";

export const checkUserExists = async (email: string): Promise<boolean> => {
  const query = "SELECT * FROM users WHERE email = ?";
  const [rows] = await pool.execute<RowDataPacket[]>(query, [email]);
  return rows.length > 0;
};

export const createUser = async (
  email: string,
  password: string,
  role: string
): Promise<UserCreationResponse> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const query = "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";
  await pool.execute(query, [email, hashedPassword, role]);

  const selectQuery =
    "SELECT user_id, email, role FROM users WHERE user_id = LAST_INSERT_ID()";
  const [rows] = await pool.query(selectQuery);
  const result = rows as UserCreationResponse[];
  console.log(result[0]);
  return result[0];
};

export const fetchUserByEmail = async (
  email: string
): Promise<fetchUserByEmailResponse> => {
  const query = "SELECT * from users WHERE email = ?";
  const [rows] = await pool.execute<fetchUserByEmailResponse[]>(query, [email]);
  console.log(rows[0]);
  return rows[0];
};

export const fetchUserById = async (
  id: number
): Promise<fetchUserByIdResponse> => {
  const query = "SELECT user_id, email, role FROM users WHERE user_id = ?";
  const [rows] = await pool.execute<fetchUserByIdResponse[]>(query, [id]);
  console.log(rows[0]);
  return rows[0];
};
