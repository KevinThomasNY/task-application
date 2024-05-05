import { RowDataPacket } from "mysql2";

export interface UserCreationResponse extends RowDataPacket{
    user_id: number;
    email: string;
}

export interface fetchUserResponse extends RowDataPacket{
    user_id: number;
    email: string;
    password: string;
}