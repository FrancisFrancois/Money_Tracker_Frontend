import { Component } from '@angular/core';
import { ReadHome } from '../../models/home';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { UserService } from 'src/app/features/user/services/user.service';

// Déclaration du composant avec son sélecteur, son template HTML et son fichier de style CSS.
@Component({
  selector: 'app-read-home',
  templateUrl: './read-home.component.html',
  styleUrls: ['./read-home.component.scss']
})
export class ReadHomeComponent {
  // Propriétés pour stocker les détails de la maison, les noms des utilisateurs et leurs rôles.
  readHome: ReadHome | undefined;
  userName: string[] = [];
  userRoles: string[] = []; // Pour stocker les rôles des utilisateurs.

  // Constructeur pour injecter les services nécessaires.
  constructor(
    private _activeRoute: ActivatedRoute, // Service pour accéder aux paramètres de route.
    private _homeService: HomeService, // Service pour les opérations sur les maisons.
    private _router: Router, // Service pour la navigation.
    private _userService: UserService // Service pour les opérations sur les utilisateurs.
  ) {
    // Appel explicite à ngOnInit pour initialiser le composant.
    this.ngOnInit();
  }

  // Méthode exécutée lors de l'initialisation du composant.
  ngOnInit(): void {
    // Récupération de l'identifiant de la maison à partir des paramètres de la route.
    const homeId = +this._activeRoute.snapshot.params['id'];
    
    // Appel au service pour obtenir les détails de la maison spécifiée.
    this._homeService.getById(homeId).subscribe({
      next: (response) => {
        // Stockage des détails de la maison dans la propriété readHome.
        this.readHome = response;
        console.log("Récupération de la maison : ", response);
        // Chargement des informations des utilisateurs.
        this.loadUser();
      },
      error: (error) => {
        // Gestion des erreurs et redirection si la maison n'est pas trouvée.
        console.error("Erreur lors de la recuperation de la maison : ", error);
        this._router.navigateByUrl('/not-found');
      },
      complete: () => {
        // Message de confirmation une fois la récupération terminée.
        console.log("Récupération de la maison terminée");
      }
    });
  }

  // Méthode pour charger les informations des utilisateurs associés à la maison.
  loadUser(): void {
    if (this.readHome && this.readHome.users) {
      this.readHome.users.forEach(user => {
        // Pour chaque utilisateur associé à la maison, récupère ses informations.
        this._userService.getById(user.user_Id).subscribe(userData => {
          // Stockage du nom complet de l'utilisateur et de ses rôles dans des tableaux.
          this.userName[user.user_Id] = `${userData.firstname} ${userData.lastname}`;
          this.userRoles[user.user_Id] = userData.roles;
        });
      });
    }
  }

  // Méthode pour supprimer un utilisateur d'une maison.
  removeUserFromHome(homeId: number, userId: number): void {
    // Appelle la méthode deleteUserFromHome de HomeService avec les IDs de maison et d'utilisateur.
    this._homeService.deleteUserFromHome(homeId, userId).subscribe({
      next: () => {
        // Logique à exécuter lorsque l'utilisateur est supprimé avec succès.
        console.log('Utilisateur supprimé avec succès');
        // Redirection vers la liste des maisons après la suppression.
        this._router.navigateByUrl('/list-home');
      },
      error: (error) => {
        // Gestion des erreurs en cas d'échec de la requête.
        console.error('Erreur lors de la suppression :', error);
      }
    });
  }
}
