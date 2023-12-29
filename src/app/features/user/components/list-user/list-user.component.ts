import { Component } from '@angular/core';
import { ListUser } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent {

  listUser : ListUser[] = [];
  isLoading : boolean = false;

  constructor( 
    private  _userService: UserService,
  ) { }

  ngOnInit(): void {
    this._userService.getAll().subscribe({
      next : (response) => {
        this.listUser = response;
        console.log("Récupération de la liste de tous les utilisateurs avec succès", response);
      },
      error : (error) => {
        console.error("Erreur lors de la recuperation de la liste des utilisateurs : ", error);
      },
      complete : () => {
        this.isLoading = false;
        console.log("Récupération de la liste des utilisateurs terminée");
      }
    }
    )
  }

  deleteUser(id : number) : void {
    this._userService.delete(id).subscribe({
      next : (response) => {
        console.log("Suppression de l'utilisateur : ", response);
        this.ngOnInit();
      },
      error : (error) => {
        console.error("Erreur lors de la suppression de l'utilisateur : ", error);
      },
      complete : () => {
        console.log("Suppression de l'utilisateur terminée");
      }
    });
  }

}
