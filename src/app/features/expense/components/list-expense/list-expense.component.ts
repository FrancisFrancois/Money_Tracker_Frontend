import { Component } from '@angular/core';
import { ListExpense } from '../../models/expense';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-list-expense',
  templateUrl: './list-expense.component.html',
  styleUrls: ['./list-expense.component.scss']
})
export class ListExpenseComponent {
  listExpense : ListExpense[] = [];
  isLoading : boolean = false;

  constructor( 
    private  _expenseService: ExpenseService,
  ) { }

  ngOnInit(): void {
    this._expenseService.getAll().subscribe({
      next : (response) => {
        this.listExpense = response;
        console.log("Récupération de la liste des dépenses avec succès", response);
      },
      error : (error) => {
        console.error("Erreur lors de la recuperation de la liste des dépenses : ", error);
      },
      complete : () => {
        this.isLoading = false;
        console.log("Récupération de la liste des dépenses terminée");
      }
    });
  }

  deleteExpense(id : number) : void {
    this._expenseService.delete(id).subscribe({
      next : (response) => {
        console.log("Suppression de la dépense : ", response);
        this.ngOnInit();
      },
      error : (error) => {
        console.error("Erreur lors de la suppression de la dépense : ", error);
      },
      complete : () => {
        console.log("Suppression de la dépense terminée");
      }
    });
  }
}

