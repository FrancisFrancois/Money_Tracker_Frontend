export interface CreateUser {
    id: number;
    lastname: string;
    firstname: string;
    pseudo: string;
    email: string;
    password: string;
}

export interface ListUser {
    id: number;
    lastname: string;
    firstname: string;
    pseudo: string;
    email: string;
    roles: string;
}

export interface ReadUser {
    id: number;
    lastname: string;
    firstname: string;
    pseudo: string;
    email: string;
    roles: string;
}