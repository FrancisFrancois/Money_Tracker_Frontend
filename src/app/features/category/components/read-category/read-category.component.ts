import { Component } from '@angular/core';
import { ReadCategory } from '../../models/category';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-read-category',
  templateUrl: './read-category.component.html',
  styleUrls: ['./read-category.component.scss']
})
export class ReadCategoryComponent {

  readCategory : ReadCategory | undefined;

  constructor(
    private _activeRoute : ActivatedRoute, 
    private _categoryService : CategoryService,
    private _router : Router,
    ) {
    let categoryId = +this._activeRoute.snapshot.params['id'];
    
    this._categoryService.getById(categoryId).subscribe({
      next : (response) => {
        this.readCategory = response;
        console.log("Récupération de la catégorie : ", response);
      },
      error : (error) => {
        console.error("Erreur lors de la recuperation de la catégorie : ", error);
        this._router.navigateByUrl('/not-found');
      },
      complete : () => {
        console.log("Récupération de la catégorie terminée");
      }
    });

}
}

