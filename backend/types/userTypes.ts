import { RowDataPacket } from "mysql2";

export interface UserCreationResponse extends RowDataPacket {
  user_id: number;
  email: string;
  role: string;
}

export interface FetchUserByEmailResponse extends RowDataPacket {
  user_id: number;
  email: string;
  password: string;
  role: string;
}

export interface FetchUserByIdResponse extends RowDataPacket {
  user_id: number;
  email: string;
  password: string;
  role: string;
}

export interface FetchAllUsersResponse {
  users: UserCreationResponse[];
}
