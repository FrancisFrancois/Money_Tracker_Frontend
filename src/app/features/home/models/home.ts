export interface CreateHome {
    id: number;
    name_Home: string;
}

export interface UpdateHome {
    id: number;
    name_Home: string;
}

export interface ListHome {
    id: number;
    name_Home: string;
}

export interface ReadHome {
    id: number;
    user_Id: number;
    name_Home: string;
    users: {
        user_Id: number;
        home_Id : number;
    }[]; 
}

export interface AddUserToHome {
    user_Id: number;
    home_Id: number;
    
}


