import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent {

  updateUserForm: FormGroup;
  userId: number;

  constructor(
    private _activeRoute : ActivatedRoute,
    private _fb: FormBuilder,
    private _userService : UserService,
    private _router: Router
  ) {
    this.userId = +this._activeRoute.snapshot.params['id'];
    
    this.updateUserForm = this._fb.group({
      lastname : [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
      firstname : [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
      pseudo : [null, [Validators.required, Validators.maxLength(45), Validators.pattern(/^[\D]*$/)]],
      email :  [null, [Validators.required,Validators.maxLength(250), Validators.email]],
      password : [null, [Validators.required, Validators.maxLength(150), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]],
      roles : [null, [Validators.required]],
    })

  }

  ngOnInit(): void {
    this._userService.getById(this.userId).subscribe({
      next : (user) => {
        this.updateUserForm.patchValue(user);
      }
    })
  }

  updateUser(): void {
    this._userService.update(this.userId, this.updateUserForm.value).subscribe({
      next : () => {
        console.log('L\'utilisateur a été mis à jour');
        this._router.navigate(['/list-user']);
      },
      error : (error) => {
        console.error('Une erreur s\'est produite lors de la mise à jour de l\'utilisateur:', error);
      },
      complete: () => {
        console.log('Mise à jour de l\'utilisateur terminée');
      }
    });
  }
}
