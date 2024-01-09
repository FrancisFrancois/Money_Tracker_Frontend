import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-update-home',
  templateUrl: './update-home.component.html',
  styleUrls: ['./update-home.component.scss']
})
export class UpdateHomeComponent {

  updateHomeForm: FormGroup;
  categoryId: number;

  constructor(
    private _activeRoute : ActivatedRoute,
    private _fb: FormBuilder,
    private _homeService : HomeService,
    private _router: Router
  ) {
    this.categoryId = +this._activeRoute.snapshot.params['id'];
    
    this.updateHomeForm = this._fb.group({
      name_Home : [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
    })

  }

  ngOnInit(): void {
    this._homeService.getById(this.categoryId).subscribe({
      next : (home) => {
        this.updateHomeForm.patchValue(home);
      }
    })
  }

  updateHome(): void {
    this._homeService.update(this.categoryId, this.updateHomeForm.value).subscribe({
      next : () => {
        console.log('La catégorie a été mis à jour');
        this._router.navigateByUrl('/list-home');
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


