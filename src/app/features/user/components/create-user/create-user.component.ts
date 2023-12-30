import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {

  createUserForm: FormGroup;

  constructor(
    private _fb : FormBuilder,
    private _userService : UserService,
    private _router: Router
    ) {
    this.createUserForm = this._fb.group({
      lastname : [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
      firstname : [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
      pseudo : [null, [Validators.required, Validators.maxLength(45), Validators.pattern(/^[\D]*$/)]],
      email :  [null, [Validators.required,Validators.maxLength(250), Validators.email]],
      password : [null, [Validators.required, Validators.maxLength(150), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]],
      roles : [null, [Validators.required]],
    })
    }

    createUser(): void {
      if (this.createUserForm.valid) {  
        this._userService.create(this.createUserForm.value).subscribe({
          next: (response) => {
            console.log("Utilisateur créé avec succès:", response);
            this._router.navigateByUrl('/list-user');
          },
          error: (error) => {
            console.error("Une erreur s'est produite lors de la création de l'utilisateur:", error);
          },
          complete: () => {
            console.log("Création de l'utilisateur terminée.");
          }
        });
        console.log(this.createUserForm.value); 
        console.log("FORMULAIRE VALIDE");
      } else {
        this.createUserForm.markAllAsTouched();
        console.log("FORMULAIRE INVALIDE");
      }
    }
  }
  
