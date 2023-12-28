import { Component } from '@angular/core';
import { ReadUser } from '../../models/user';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-read-user',
  templateUrl: './read-user.component.html',
  styleUrls: ['./read-user.component.scss']
})
export class ReadUserComponent {

  readUser : ReadUser | undefined;

  constructor(
    private _activeRoute : ActivatedRoute, 
    private _userService : UserService,
    private _router : Router,
    ) {
    let userId = +this._activeRoute.snapshot.params['id'];
    
    this._userService.getById(userId).subscribe({
      next : (response) => {
        this.readUser = response;
        console.log("Récupération de l'utilisateur : ", response);
      },
      error : (error) => {
        console.error("Erreur lors de la recuperation de l'utilisateur : ", error);
        this._router.navigateByUrl('/not-found');
      },
      complete : () => {
        console.log("Récupération de l'utilisateur terminée");
      }
    });

}
}
