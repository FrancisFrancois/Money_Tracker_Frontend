import { Component } from '@angular/core';
import { ListUser } from '../../models/user';
import { UserService } from '../../services/user.service';

// Déclaration du composant avec son sélecteur, son template HTML et son fichier de style CSS.
@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent {

  // Propriété pour stocker la liste des utilisateurs et un indicateur de chargement.
  listUser: ListUser[] = [];
  isLoading: boolean = false;

  // Constructeur pour injecter le service UserService.
  constructor(private _userService: UserService) { }

  // Méthode ngOnInit appelée lors de l'initialisation du composant.
  ngOnInit(): void {
    // Appel au service UserService pour obtenir tous les utilisateurs.
    this._userService.getAll().subscribe({
      next: (response) => {
        // Stockage des utilisateurs dans la propriété listUser.
        this.listUser = response;
        console.log("Récupération de la liste de tous les utilisateurs avec succès", response);
      },
      error: (error) => {
        // Gestion des erreurs lors de la récupération des utilisateurs.
        console.error("Erreur lors de la recuperation de la liste des utilisateurs : ", error);
      },
      complete: () => {
        // Mise à jour de l'indicateur de chargement.
        this.isLoading = false;
        console.log("Récupération de la liste des utilisateurs terminée");
      }
    });
  }

  // Méthode pour supprimer un utilisateur.
  deleteUser(id: number): void {
    // Appel au service UserService pour supprimer un utilisateur par son identifiant.
    this._userService.delete(id).subscribe({
      next: (response) => {
        // Traitement après la suppression réussie d'un utilisateur.
        console.log("Suppression de l'utilisateur : ", response);
        // Rechargement de la liste des utilisateurs.
        this.ngOnInit();
      },
      error: (error) => {
        // Gestion des erreurs lors de la suppression.
        console.error("Erreur lors de la suppression de l'utilisateur : ", error);
      },
      complete: () => {
        // Message de confirmation une fois la suppression terminée.
        console.log("Suppression de l'utilisateur terminée");
      }
    });
  }
}
