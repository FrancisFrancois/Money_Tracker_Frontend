import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent {

  createCategoryForm: FormGroup;

  
  constructor(
    private _fb : FormBuilder,
    private _categoryService : CategoryService,
    private _router: Router
    ) {
    this.createCategoryForm = this._fb.group({
      category_Name : [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
    })
    }

    createCategory() {
      if (this.createCategoryForm.valid) {  
        this._categoryService.create(this.createCategoryForm.value).subscribe({
          next: (response) => {
            console.log("Categorie ajoutée avec succès:", response);
            this._router.navigateByUrl('/list-category');
          },
          error: (error) => {
            console.error("Une erreur s'est produite lors de la création de la categorie:", error);
          },
          complete: () => {
            console.log("Création de la categorie terminée.");
          }
        });
        console.log(this.createCategoryForm.value); 
        console.log("FORMULAIRE VALIDE");
      } else {
        this.createCategoryForm.markAllAsTouched();
        console.log("FORMULAIRE INVALIDE");
      }
    }
}
