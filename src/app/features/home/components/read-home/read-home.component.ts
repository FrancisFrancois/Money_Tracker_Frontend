import { Component } from '@angular/core';
import { ReadHome } from '../../models/home';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { ReadUser } from 'src/app/features/user/models/user';

@Component({
  selector: 'app-read-home',
  templateUrl: './read-home.component.html',
  styleUrls: ['./read-home.component.scss']
})
export class ReadHomeComponent {

  readHome : ReadHome | undefined;

  constructor(
    private _activeRoute : ActivatedRoute, 
    private _homeService : HomeService,
    private _router : Router,
    ) {
    let homeId = +this._activeRoute.snapshot.params['id'];
    
    this._homeService.getById(homeId).subscribe({
      next : (response) => {
        this.readHome = response;
        console.log("Récupération de la maison : ", response);
      },
      error : (error) => {
        console.error("Erreur lors de la recuperation de la maison : ", error);
        this._router.navigateByUrl('/not-found');
      },
      complete : () => {
        console.log("Récupération de la maison terminée");
      }
    });
  }
}
