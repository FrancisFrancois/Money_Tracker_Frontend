import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListCategory } from 'src/app/features/category/models/category';
import { ListHome } from 'src/app/features/home/models/home';
import { ListUser } from 'src/app/features/user/models/user';
import { ExpenseService } from '../../services/expense.service';
import { UserService } from 'src/app/features/user/services/user.service';
import { CategoryService } from 'src/app/features/category/services/category.service';
import { HomeService } from 'src/app/features/home/services/home.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-expense',
  templateUrl: './update-expense.component.html',
  styleUrls: ['./update-expense.component.scss']
})
export class UpdateExpenseComponent {

  // Propriétés pour le formulaire et les listes de catégories, maisons et utilisateurs.
  updateExpenseForm: FormGroup;
  expenseId: number;
  categories: ListCategory[] = [];
  homes: ListHome[] = [];
  users: ListUser[] = [];

  // Propriétés pour stocker les ID sélectionnés.
  selectedCategoryId!: number;
  selectedHomeId!: number;
  selectedUserId!: number;
  
  // Constructeur pour injecter les services nécessaires.
  constructor(
    private _fb: FormBuilder, // Service pour la création de formulaires.
    private _expenseService: ExpenseService, // Service pour la gestion des dépenses.
    private _userService: UserService, // Service pour la gestion des utilisateurs.
    private _categoryService: CategoryService, // Service pour la gestion des catégories.
    private _homeService: HomeService, // Service pour la gestion des maisons.
    private _activeRoute: ActivatedRoute, // Service pour accéder aux paramètres de la route.
    private _router: Router // Service pour la navigation.
  ) {
    // Récupération de l'ID de la dépense depuis les paramètres de route.
    this.expenseId = +this._activeRoute.snapshot.params['id'];

    // Initialisation du formulaire avec des validateurs.
    this.updateExpenseForm = this._fb.group({
      category_Id: [null, [Validators.required]],
      user_Id: [null, [Validators.required]],
      home_Id: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      description: [null, [Validators.required, Validators.maxLength(300)]],
      date_Expense: [null, [Validators.required]],
    })
  }

  // Méthode exécutée lors de l'initialisation du composant.
  ngOnInit(): void {
    // Récupération des détails de la dépense pour pré-remplir le formulaire.
    this._expenseService.getById(this.expenseId).subscribe({
      next: (expense) => {
        this.updateExpenseForm.patchValue(expense);
        this.loadLists();
      }
    })
  }

  // Méthode pour mettre à jour une dépense.
  updateExpense(): void {
    // Vérifie si le formulaire est valide avant de soumettre les données.
    if (this.updateExpenseForm.valid) {
      const formData = this.updateExpenseForm.value;

      // Appel au service pour mettre à jour la dépense.
      this._expenseService.update(this.expenseId, formData).subscribe({
        next: () => {
          console.log("Dépense modifiée avec succès:");
          // Redirection vers la liste des dépenses après la mise à jour.
          this._router.navigateByUrl('/list-expense');
        },
        error: (error) => {
          console.error("Erreur lors de la modification de la dépense:", error);
        },
        complete: () => {
          console.log("Modification de la dépense terminée.");
        }
      });
    }
  }

  // Méthodes pour charger les listes de catégories, maisons et utilisateurs.
  loadLists() {
    this._categoryService.getAll().subscribe({
      next: (data) => { 
        this.categories = data; 
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

  // Méthodes pour gérer les changements de sélection dans les listes déroulantes.
  onCategoryChange(name: string) {
    this.selectedCategoryId = this.findIdByName(this.categories, name);
  }

  onHomeChange(name: string) {
    this.selectedHomeId = this.findIdByName(this.homes, name);
  }

  onUserChange(name: string) {
    this.selectedUserId = this.findIdByName(this.users, name);
  }

  // Méthode pour trouver un ID par nom dans une liste donnée.
  findIdByName(list: any[], name: string): number {
    const item = list.find(item => item.name === name);
    return item ? item.id : null;
  }
}