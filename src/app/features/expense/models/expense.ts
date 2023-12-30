export interface CreateExpense {
    category_Id: number;
    user_Id: number;
    home_Id: number;
    amount: number;
    description: string;
    date_Expense: Date
}

export interface UpdateExpense {
    id: number;
    category_Id: number;
    user_Id: number;
    home_Id: number;
    amount: number;
    description: string;
    date_Expense: Date
}

export interface ListExpense {
    id: number;
    category_Id: number;
    user_Id: number;
    home_Id: number;
    amount: number;
    description: string;
    date_Expense: Date
}

export interface ReadExpense {
    id: number;
    category_Id: number;
    user_Id: number;
    home_Id: number;
    amount: number;
    description: string;
    date_Expense: Date
}


