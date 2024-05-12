import { RowDataPacket } from "mysql2";

export interface UserCreationResponse extends RowDataPacket{
    user_id: number;
    email: string;
    role: string;
}

export interface fetchUserByEmailResponse extends RowDataPacket{
    user_id: number;
    email: string;
    password: string;
    role: string;
}
export interface fetchUserByIdResponse extends RowDataPacket{
    user_id: number;
    email: string;
    role: string;
}