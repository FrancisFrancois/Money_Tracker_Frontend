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

  createExpenseForm: FormGroup;
  categories: ListCategory[] = [];
  homes: ListHome[] = [];
  users: ListUser[] = [];;

  selectedCategoryId!: number;
  selectedHomeId!: number;
  selectedUserId!: number;
  
  constructor(
    private _fb : FormBuilder,
    private _expenseService : ExpenseService,
    private _userService : UserService,
    private _categoryService : CategoryService,
    private _homeService : HomeService,
    private _router: Router
    ) {
    this.createExpenseForm = this._fb.group({
      category_Id : [null, [Validators.required]],
      user_Id : [null, [Validators.required]],
      home_Id : [null, [Validators.required]],
      amount : [null, [Validators.required]],
      description : [null, [Validators.required, Validators.maxLength(300), Validators.pattern(/^[\D]*$/)]],
      date_Expense : [null, [Validators.required]],
    })
    }

    ngOnInit(): void {
      this.loadLists();
    }

    createExpense(): void {
      if (this.createExpenseForm.valid) {  
        const formData = this.createExpenseForm.value;
    
        const expenseData = {
          category_Id: this.selectedCategoryId,
          user_Id: this.selectedUserId,
          home_Id: this.selectedHomeId,
          amount: formData.amount,
          description: formData.description,
          date_Expense: formData.date_Expense
        };

        this._expenseService.create(expenseData).subscribe({
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

    onCategoryChange(name: string) {
      this.selectedCategoryId = this.findIdByName(this.categories, name);
    }
  
    onHomeChange(name: string) {
      this.selectedHomeId = this.findIdByName(this.homes, name);
    }
  
    onUserChange(name: string) {
      this.selectedUserId = this.findIdByName(this.users, name);
    }
  
    findIdByName(list: any[], name: string): number {
      const item = list.find(item => item.name === name);
      return item ? item.id : null;
    }
}
