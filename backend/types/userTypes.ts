import { RowDataPacket } from "mysql2";

export interface UserCreationResponse extends RowDataPacket{
    user_id: number;
    email: string;
}