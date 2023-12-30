import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from '../../services/home.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/features/user/services/user.service';
import { ListUser } from 'src/app/features/user/models/user';

@Component({
  selector: 'app-create-home',
  templateUrl: './create-home.component.html',
  styleUrls: ['./create-home.component.scss']
})
export class CreateHomeComponent {

  createHomeForm: FormGroup;
  users: ListUser[] = [];

  
  constructor(
    private _fb : FormBuilder,
    private _homeService : HomeService,
    private _userService : UserService,
    private _router: Router
    ) {
    this.createHomeForm = this._fb.group({
      category_Name : [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
    })
    }

    createHome() {
      if (this.createHomeForm.valid) {  
        this._homeService.create(this.createHomeForm.value).subscribe({
          next: (response) => {
            console.log("Maison ajoutée avec succès:", response);
            this._router.navigateByUrl('/list-home');
          },
          error: (error) => {
            console.error("Une erreur s'est produite lors de la création de la maison:", error);
          },
          complete: () => {
            console.log("Création de la maison terminée.");
          }
        });
        console.log(this.createHomeForm.value); 
        console.log("FORMULAIRE VALIDE");
      } else {
        this.createHomeForm.markAllAsTouched();
        console.log("FORMULAIRE INVALIDE");
      }
    }

    ngOnInit(): void {
      this.loadUsers();
    }

    loadUsers() {
      this._userService.getAll().subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des utilisateurs', err);
        }
      });
    }
}

