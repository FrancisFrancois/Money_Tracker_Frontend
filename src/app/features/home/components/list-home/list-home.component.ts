import { Component } from '@angular/core';
import { ListHome } from '../../models/home';
import { HomeService } from '../../services/home.service';

// Déclaration du composant avec son sélecteur, son template HTML et son fichier de style CSS.
@Component({
  selector: 'app-list-home',
  templateUrl: './list-home.component.html',
  styleUrls: ['./list-home.component.scss']
})
export class ListHomeComponent {

  // Propriété pour stocker la liste des maisons et un indicateur de chargement.
  listHome: ListHome[] = [];
  isLoading: boolean = false;

  // Constructeur pour injecter le service HomeService.
  constructor(private _homeService: HomeService) { }

  // Méthode ngOnInit appelée lors de l'initialisation du composant.
  ngOnInit(): void {
    // Appel au service HomeService pour obtenir toutes les maisons.
    this._homeService.getAll().subscribe({
      next: (response) => {
        // Stockage des maisons dans la propriété listHome.
        this.listHome = response;
        console.log("Récupération de la liste des maisons avec succès", response);
      },
      error: (error) => {
        // Gestion des erreurs lors de la récupération des maisons.
        console.error("Erreur lors de la recuperation de la liste des maisons : ", error);
      },
      complete: () => {
        // Mise à jour de l'indicateur de chargement.
        this.isLoading = false;
        console.log("Récupération de la liste des maisons terminée");
      }
    });
  }

  // Méthode pour supprimer une maison.
  deleteHome(id: number): void {
    // Appel au service HomeService pour supprimer une maison par son identifiant.
    this._homeService.delete(id).subscribe({
      next: (response) => {
        // Traitement après la suppression réussie d'une maison.
        console.log("Suppression de la maison : ", response);
        // Rechargement de la liste des maisons.
        this.ngOnInit();
      },
      error: (error) => {
        // Gestion des erreurs lors de la suppression.
        console.error("Erreur lors de la suppression de la maison : ", error);
      },
      complete: () => {
        // Message de confirmation une fois la suppression terminée.
        console.log("Suppression de la maison terminée");
      }
    });
  }
}

