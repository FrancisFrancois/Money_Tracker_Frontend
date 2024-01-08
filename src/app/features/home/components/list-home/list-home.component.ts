import { Component } from '@angular/core';
import { ListHome } from '../../models/home';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-list-home',
  templateUrl: './list-home.component.html',
  styleUrls: ['./list-home.component.scss']
})
export class ListHomeComponent {

  listHome : ListHome[] = [];
  isLoading : boolean = false;

  constructor( 
    private  _homeService: HomeService,
  ) { }

  ngOnInit(): void {
    this._homeService.getAll().subscribe({
      next : (response) => {
        this.listHome = response;
        console.log("Récupération de la liste des maisons avec succès", response);
      },
      error : (error) => {
        console.error("Erreur lors de la recuperation de la liste des maisons : ", error);
      },
      complete : () => {
        this.isLoading = false;
        console.log("Récupération de la liste des maisons terminée");
      }
    });
  }

  deleteHome(id : number) : void {
    this._homeService.delete(id).subscribe({
      next : (response) => {
        console.log("Suppression de la maison : ", response);
        this.ngOnInit();
      },
      error : (error) => {
        console.error("Erreur lors de la suppression de la maison : ", error);
      },
      complete : () => {
        console.log("Suppression de la maison terminée");
      }
    });
  }
}

