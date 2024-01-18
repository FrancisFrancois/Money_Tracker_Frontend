import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { Router } from '@angular/router';
import { ListCategory } from 'src/app/features/category/models/category';
import { ListHome } from 'src/app/features/home/models/home';
import { ListUser } from 'src/app/features/user/models/user';
import { UserService } from 'src/app/features/user/services/user.service';
import { CategoryService } from 'src/app/features/category/services/category.service';
import { HomeService } from 'src/app/features/home/services/home.service';

@Component({
  selector: 'app-create-expense',
  templateUrl: './create-expense.component.html',
  styleUrls: ['./create-expense.component.scss']
})
export class CreateExpenseComponent {

  // Déclaration des propriétés pour le formulaire et les listes de catégories, maisons et utilisateurs
  createExpenseForm: FormGroup;
  categories: ListCategory[] = [];
  homes: ListHome[] = [];
  users: ListUser[] = [];;

  // Propriétés pour conserver les ID sélectionnés
  selectedCategoryId!: number;
  selectedHomeId!: number;
  selectedUserId!: number;
  
  // Constructeur pour injecter les services et initialiser le formulaire
  constructor(
    private _fb : FormBuilder, // Service FormBuilder pour construire le formulaire
    private _expenseService : ExpenseService, // Service pour gérer les dépenses
    private _userService : UserService, // Service pour gérer les utilisateurs
    private _categoryService : CategoryService, // Service pour gérer les catégories
    private _homeService : HomeService, // Service pour gérer les maisons
    private _router: Router // Service Router pour la navigation
    ) {
    // Initialisation du formulaire avec des contrôles et des validateurs
    this.createExpenseForm = this._fb.group({
      category_Id : [null, [Validators.required]],
      user_Id : [null, [Validators.required]],
      home_Id : [null, [Validators.required]],
      amount : [null, [Validators.required]],
      description : [null, [Validators.required, Validators.maxLength(300)]],
      date_Expense : [null, [Validators.required]],
    })
    }

    // Méthode ngOnInit pour charger les listes au démarrage du composant
    ngOnInit(): void {
      this.loadLists();
    }

    // Méthode pour créer une dépense
    createExpense(): void {
      // Vérification de la validité du formulaire
      if (this.createExpenseForm.valid) {  
        const formData = this.createExpenseForm.value;

        // Appel au service pour créer la dépense et gestion des réponses
        this._expenseService.create(formData).subscribe({
          next: (response) => {
            console.log("Dépense ajoutée avec succès:", response);
            this._router.navigateByUrl('/list-expense');
          },
          error: (error) => {
            console.error("Une erreur s'est produite lors de la création de la dépense:", error);
          },
          complete: () => {
            console.log("Création de la dépense terminée.");
          }
        });
      } else {
        this.createExpenseForm.markAllAsTouched();
        console.log("FORMULAIRE INVALIDE");
      }
    }
    // Méthode pour charger les listes des catégories, maisons et utilisateurs
    loadLists() {
      this._categoryService.getAll().subscribe({
        next: (data) => {
          this.categories = data;
          console.log(data);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des catégories', err);
        }
      });
  
      this._homeService.getAll().subscribe({
        next: (data) => {
          this.homes = data;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des maisons', err);
        }
      });
  
      this._userService.getAll().subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des utilisateurs', err);
        }
      });
    }

    // Méthodes pour gérer les changements de sélection dans les listes déroulantes
    onCategoryChange(name: string) {
      this.selectedCategoryId = this.findIdByName(this.categories, name);
      console.log(this.selectedCategoryId);
    }
  
    onHomeChange(name: string) {
      this.selectedHomeId = this.findIdByName(this.homes, name);
    }
  
    onUserChange(name: string) {
      this.selectedUserId = this.findIdByName(this.users, name);
    }
  
    // Méthode pour trouver un ID à partir d'un nom dans une liste
    findIdByName(list: any[], name: string): number {
      const item = list.find(item => item.name === name);
      return item ? item.id : null;
    }
}
