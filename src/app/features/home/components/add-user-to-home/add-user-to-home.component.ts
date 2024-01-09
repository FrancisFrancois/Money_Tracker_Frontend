import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from '../../services/home.service';
import { UserService } from 'src/app/features/user/services/user.service';
import { Router } from '@angular/router';
import { ListUser } from 'src/app/features/user/models/user';
import { ListHome } from '../../models/home';

@Component({
  selector: 'app-add-user-to-home',
  templateUrl: './add-user-to-home.component.html',
  styleUrls: ['./add-user-to-home.component.scss']
})
export class AddUserToHomeComponent {

  AddUserToHomeForm: FormGroup;
  users: ListUser[] = [];
  homes : ListHome[] = [];

  constructor(
    private _fb : FormBuilder,
    private _homeService : HomeService,
    private _userService : UserService,
    private _router: Router
  ) {
  this.AddUserToHomeForm = this._fb.group({
    user_Id : [null, [Validators.required]],
    home_Id : [null, [Validators.required]],
  })
  }

  addUserToHome(){
    if (this.AddUserToHomeForm.valid) {
      this._homeService.addUserToHome(this.AddUserToHomeForm.value).subscribe({
        next : (response) => {
          this._router.navigateByUrl('/list-home')
        },
        error : (error) => {
          console.log(" Une erreur s'est produite lors de l'ajout de l'utilisateur à la maison", error)
        },
        complete : () => {
          console.log("L'utilisateur a bien été ajouté à la maison")
        }
      });
      console.log(this.AddUserToHomeForm.value);
      console.log("FORMULAIRE VALIDE");
    } else {
      this.AddUserToHomeForm.markAllAsTouched();
      console.log("FORMULAIRE INVALIDE");
    }
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadHomes();
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

  loadHomes() {
    this._homeService.getAll().subscribe({
      next: (data) => {
        this.homes = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des maisons', err);
      }
    });
  }

}
