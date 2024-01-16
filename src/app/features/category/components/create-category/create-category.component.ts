import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';

// Décore le composant avec @Component pour spécifier le sélecteur, le template HTML, et les styles CSS.
@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent {

  // Déclare la variable createCategoryForm de type FormGroup.
  createCategoryForm: FormGroup;

  // Injecte les dépendances nécessaires :
  constructor(
    private _fb : FormBuilder,
    private _categoryService : CategoryService,
    private _router: Router
  ) {
    // Initialise le formulaire avec FormBuilder, en définissant les contrôles et les validateurs.
    this.createCategoryForm = this._fb.group({
      category_Name : [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
    })
  }

  // Méthode pour créer une catégorie.
  createCategory(): void {
    // Vérifie si le formulaire est valide.
    if (this.createCategoryForm.valid) {  
      // Appelle la méthode create du CategoryService et s'abonne aux résultats.
      this._categoryService.create(this.createCategoryForm.value).subscribe({
        next: (response) => {
          console.log("Categorie ajoutée avec succès:", response);
          // Redirige vers la liste des catégories en cas de succès.
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
      // Marque tous les contrôles du formulaire comme touchés si le formulaire est invalide.
      this.createCategoryForm.markAllAsTouched();
      console.log("FORMULAIRE INVALIDE");
    }
  }
}
