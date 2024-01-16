import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss']
})
export class UpdateCategoryComponent {

  updateCategoryForm: FormGroup;
  categoryId: number;

  // Constructeur du composant
  constructor(
    private _activeRoute : ActivatedRoute,
    private _fb: FormBuilder,
    private _categoryService : CategoryService,
    private _router: Router
  ) {
    // Extraction de l'ID de la catégorie à partir de l'URL
    this.categoryId = +this._activeRoute.snapshot.params['id'];

    // Initialisation du formulaire avec des validations
    this.updateCategoryForm = this._fb.group({
      category_Name : [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
    })
  }

  // Pppelée à l'initialisation du composant
  ngOnInit(): void {
    // Récupération des détails de la catégorie à mettre à jour par ID
    this._categoryService.getById(this.categoryId).subscribe({
      next : (category) => {
        // Patch des détails de la catégorie dans le formulaire
        this.updateCategoryForm.patchValue(category);
      }
    })
  }

  // Méthode pour mettre à jour la catégorie
  updateCategory(): void {
    // Appel du service pour effectuer la mise à jour
    this._categoryService.update(this.categoryId, this.updateCategoryForm.value).subscribe({
      next : () => {
        // En cas de succès, affiche un message et redirige vers la liste des catégories
        console.log('La catégorie a été mise à jour');
        this._router.navigateByUrl("/list-category");
      },
      error : (error) => {
        // En cas d'erreur, affiche un message d'erreur
        console.error('Une erreur s\'est produite lors de la mise à jour de la catégorie :', error);
      },
      complete: () => {
        // Indique que la mise à jour est terminée
        console.log('Mise à jour de la catégorie terminée');
      }
    });
  }
}
