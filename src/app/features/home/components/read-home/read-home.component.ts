import { Component } from '@angular/core';
import { ReadHome } from '../../models/home';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { UserService } from 'src/app/features/user/services/user.service';

@Component({
  selector: 'app-read-home',
  templateUrl: './read-home.component.html',
  styleUrls: ['./read-home.component.scss']
})

export class ReadHomeComponent {
  readHome: ReadHome | undefined;
  userName: string[] = [];

  constructor(
    private _activeRoute: ActivatedRoute, 
    private _homeService: HomeService,
    private _router: Router,
    private _userService: UserService
  ) {
    this.ngOnInit();
  }

  ngOnInit(): void {
    const homeId = +this._activeRoute.snapshot.params['id'];
    
    this._homeService.getById(homeId).subscribe({
      next: (response) => {
        this.readHome = response;
        console.log("Récupération de la maison : ", response);
        this.loadUser();
      },
      error: (error) => {
        console.error("Erreur lors de la recuperation de la maison : ", error);
        this._router.navigateByUrl('/not-found');
      },
      complete: () => {
        console.log("Récupération de la maison terminée");
      }
    });
  }

  loadUser(): void {
    if (this.readHome && this.readHome.users) {
      this.readHome.users.forEach(user => {
        this._userService.getById(user.user_Id).subscribe(userData => {
          this.userName[user.user_Id] = `${userData.firstname} ${userData.lastname}`; 
        });
      });
    }
  }
}
