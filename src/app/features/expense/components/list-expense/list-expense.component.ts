import { Component } from '@angular/core';
import { ListExpense } from '../../models/expense';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-list-expense',
  templateUrl: './list-expense.component.html',
  styleUrls: ['./list-expense.component.scss']
})
export class ListExpenseComponent {
  // Déclaration d'une propriété pour stocker la liste des dépenses et une propriété pour indiquer si le chargement est en cours
  listExpense : ListExpense[] = [];
  isLoading : boolean = false;

  // Constructeur pour injecter le service de gestion des dépenses
  constructor( 
    private  _expenseService: ExpenseService,
  ) { }

  // Méthode ngOnInit appelée lors de l'initialisation du composant
  ngOnInit(): void {
    // Appel au service pour obtenir toutes les dépenses
    this._expenseService.getAll().subscribe({
      next : (response) => {
        // Traitement de la réponse : tri des dépenses par date et mise à jour de la liste des dépenses
        this.listExpense = response.sort((a, b) => 
        new Date(b.date_Expense).getTime() - new Date(a.date_Expense).getTime());
        console.log("Récupération de la liste des dépenses avec succès", response);
      },
      error : (error) => {
        // Gestion des erreurs lors de la récupération des données
        console.error("Erreur lors de la recuperation de la liste des dépenses : ", error);
      },
      complete : () => {
        // Mise à jour de l'indicateur de chargement une fois que la récupération des données est terminée
        this.isLoading = false;
        console.log("Récupération de la liste des dépenses terminée");
      }
    });
  }

  // Méthode pour supprimer une dépense par son identifiant
  deleteExpense(id : number) : void {
    // Appel au service pour supprimer la dépense spécifiée
    this._expenseService.delete(id).subscribe({
      next : (response) => {
        // Traitement de la réponse après la suppression d'une dépense
        console.log("Suppression de la dépense : ", response);
        // Rechargement de la liste des dépenses après la suppression
        this.ngOnInit();
      },
      error : (error) => {
        // Gestion des erreurs lors de la tentative de suppression d'une dépense
        console.error("Erreur lors de la suppression de la dépense : ", error);
      },
      complete : () => {
        // Message de confirmation une fois la suppression terminée
        console.log("Suppression de la dépense terminée");
      }
    });
  }
}
