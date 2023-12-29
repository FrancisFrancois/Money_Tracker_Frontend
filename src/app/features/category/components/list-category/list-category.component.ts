import { Component } from '@angular/core';
import { ListCategory } from '../../models/category';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent {

  listCategory : ListCategory[] = [];
  isLoading : boolean = false;

  constructor( 
    private  _categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    this._categoryService.getAll().subscribe({
      next : (response) => {
        this.listCategory = response;
        console.log("Récupération de la liste des catégories avec succès", response);
      },
      error : (error) => {
        console.error("Erreur lors de la recuperation de la liste des catégories : ", error);
      },
      complete : () => {
        this.isLoading = false;
        console.log("Récupération de la liste des catégories terminée");
      }
    });
  }

  deleteCategory(id : number) : void {
    this._categoryService.delete(id).subscribe({
      next : (response) => {
        console.log("Suppression de la catégorie : ", response);
        this.ngOnInit();
      },
      error : (error) => {
        console.error("Erreur lors de la suppression de la catégorie : ", error);
      },
      complete : () => {
        console.log("Suppression de la catégorie terminée");
      }
    });
  }
}
