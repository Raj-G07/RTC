import { connection } from 'websocket';

export interface User{
    id: string;
    name: string;
    conn: connection;
}

export interface Room {
    users: User[];
}

