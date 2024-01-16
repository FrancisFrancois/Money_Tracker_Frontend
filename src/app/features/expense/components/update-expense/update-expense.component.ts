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

  updateExpenseForm: FormGroup;
  expenseId: number;
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
    private _activeRoute : ActivatedRoute,
    private _router: Router
    ) {
      
    this.expenseId = +this._activeRoute.snapshot.params['id'];

    this.updateExpenseForm = this._fb.group({
      category_Id : [null, [Validators.required]],
      user_Id : [null, [Validators.required]],
      home_Id : [null, [Validators.required]],
      amount : [null, [Validators.required]],
      description : [null, [Validators.required, Validators.maxLength(300)]],
      date_Expense : [null, [Validators.required]],
    })
    }

  ngOnInit(): void {
    this._expenseService.getById(this.expenseId).subscribe({
      next : (expense) => {
        this.updateExpenseForm.patchValue(expense);
        this.loadLists();
      }
    })
  }

  updateExpense(): void {
    if (this.updateExpenseForm.valid) {  
      const formData = this.updateExpenseForm.value;
  
      this._expenseService.update(this.expenseId, formData).subscribe({
        next: () => {
          console.log("Dépense modifié avec succès:");
          this._router.navigateByUrl('/list-expense');
        },
        error: (error) => {
          console.error("Une erreur s'est produite lors de la modification de la dépense:", error);
        },
        complete: () => {
          console.log("Modification de la dépense terminée.");
        }
      });
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
