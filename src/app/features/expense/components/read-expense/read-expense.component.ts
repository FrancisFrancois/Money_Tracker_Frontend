import { Component } from '@angular/core';
import { ReadExpense } from '../../models/expense';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { UserService } from 'src/app/features/user/services/user.service';
import { HomeService } from 'src/app/features/home/services/home.service';
import { CategoryService } from 'src/app/features/category/services/category.service';

@Component({
  selector: 'app-read-expense',
  templateUrl: './read-expense.component.html',
  styleUrls: ['./read-expense.component.scss']
})
export class ReadExpenseComponent {

  // Déclaration des propriétés pour stocker les informations de la dépense et les noms associés
  readExpense : ReadExpense | undefined;
  userName : string = '';
  homeName: string = '';
  categoryName: string = '';

  // Constructeur pour injecter les services nécessaires
  constructor(
    private _activeRoute : ActivatedRoute, // Service pour accéder aux paramètres de route
    private _expenseService : ExpenseService, // Service pour les opérations sur les dépenses
    private _userService : UserService, // Service pour les opérations sur les utilisateurs
    private _homeService : HomeService, // Service pour les opérations sur les maisons
    private _categoryService : CategoryService, // Service pour les opérations sur les catégories
    private _router : Router, // Service pour la navigation
    ) {
      // Appel explicite à ngOnInit pour initialiser le composant
      this.ngOnInit();
    }
      
    // Méthode ngOnInit appelée lors de l'initialisation du composant
    ngOnInit(): void {
      // Récupération de l'identifiant de la dépense à partir des paramètres de la route
      let expenseId = +this._activeRoute.snapshot.params['id'];
      
      // Appel au service pour obtenir les détails de la dépense spécifiée
      this._expenseService.getById(expenseId).subscribe({
        next : (response) => {
          this.readExpense = response;
          // Chargement des noms associés à l'utilisateur, à la maison et à la catégorie
          this.loadUserName(this.readExpense.user_Id);
          this.loadHomeName(this.readExpense.home_Id);
          this.loadCategoryName(this.readExpense.category_Id);
          console.log("Récupération de la dépense : ", response);
        },
        error : (error) => {
          // Gestion des erreurs et redirection si la dépense n'est pas trouvée
          console.error("Erreur lors de la recuperation de la dépense : ", error);
          this._router.navigateByUrl('/not-found');
        },
        complete : () => {
          console.log("Récupération de la dépense terminée");
        }
      });
    }

    // Méthodes pour charger les informations associées à l'utilisateur, la maison et la catégorie
    loadUserName(userId: number): void {
      this._userService.getById(userId).subscribe({
        next: (userData) => {
          this.userName = `${userData.firstname} ${userData.lastname}`;
        },
        error: (error) => {
          console.error("Erreur lors de la récupération des informations de l'utilisateur :", error);
        }
      });
    } 

    loadHomeName(homeId: number): void {
      this._homeService.getById(homeId).subscribe({
        next: (homeData) => {
          this.homeName = homeData.name_Home;
        },
        error: (error) => {
          console.error("Erreur lors de la récupération des informations de la maison :", error);
        }
      });
    }

    loadCategoryName(categoryId: number): void {
      this._categoryService.getById(categoryId).subscribe({
        next: (categoryData) => {
          this.categoryName = categoryData.category_Name;
        },
        error: (err) => {
          console.error("Erreur lors de la récupération des informations de la catégorie :", err);
        }
      });
    }
}
