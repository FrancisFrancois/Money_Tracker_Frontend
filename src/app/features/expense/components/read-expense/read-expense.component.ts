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

  readExpense : ReadExpense | undefined;
  userName : string = '';
  homeName: string = '';
  categoryName: string = '';

  constructor(
    private _activeRoute : ActivatedRoute, 
    private _expenseService : ExpenseService,
    private _userService : UserService,
    private _homeService : HomeService,
    private _categoryService : CategoryService,
    private _router : Router,
    ) {
      this.ngOnInit();
    }
      
    ngOnInit(): void {
    let expenseId = +this._activeRoute.snapshot.params['id'];
    
    this._expenseService.getById(expenseId).subscribe({
      next : (response) => {
        this.readExpense = response;
          this.loadUserName(this.readExpense.user_Id);
          this.loadHomeName(this.readExpense.home_Id);
          this.loadCategoryName(this.readExpense.category_Id);
          console.log("Récupération de la dépense : ", response);
      },
      error : (error) => {
        console.error("Erreur lors de la recuperation de la dépense : ", error);
        this._router.navigateByUrl('/not-found');
      },
      complete : () => {
        console.log("Récupération de la dépense terminée");
      }
    });
  }

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
