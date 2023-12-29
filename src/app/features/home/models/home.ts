export interface CreateHome {
    user_Id: number;
    name_Home: string;
}

export interface UpdateHome {
    user_Id: number;
    name_Home: string;
}

export interface ListHome {
    id: number;
    user_Id: number;
    name_Home: string;
}

export interface ReadHome {
    id : number;
    user_Id: number;
    name_Home: string;
    users: number[];
    
}
