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

  constructor(
    private _activeRoute : ActivatedRoute,
    private _fb: FormBuilder,
    private _categoryService : CategoryService,
    private _router: Router
  ) {
    this.categoryId = +this._activeRoute.snapshot.params['id'];
    
    this.updateCategoryForm = this._fb.group({
      category_Name : [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
    })

  }

  ngOnInit(): void {
    this._categoryService.getById(this.categoryId).subscribe({
      next : (category) => {
        this.updateCategoryForm.patchValue(category);
      }
    })
  }

  updateCategory(): void {
    this._categoryService.update(this.categoryId, this.updateCategoryForm.value).subscribe({
      next : () => {
        console.log('La catégorie a été mis à jour');
        this._router.navigate(['/user']);
      },
      error : (error) => {
        console.error('Une erreur s\'est produite lors de la mise à jour de la catégorie :', error);
      },
      complete: () => {
        console.log('Mise à jour de la catégorie terminée');
      }
    });
  }
}

