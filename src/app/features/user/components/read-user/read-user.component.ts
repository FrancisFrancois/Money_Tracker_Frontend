import { Component } from '@angular/core';
import { ReadUser } from '../../models/user';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

// Déclaration du composant avec son sélecteur, son template HTML et son fichier de style CSS.
@Component({
  selector: 'app-read-user',
  templateUrl: './read-user.component.html',
  styleUrls: ['./read-user.component.scss']
})
export class ReadUserComponent {

  // Propriété pour stocker les détails de l'utilisateur.
  readUser: ReadUser | undefined;

  // Constructeur pour injecter les services nécessaires.
  constructor(
    private _activeRoute: ActivatedRoute, // Service pour accéder aux paramètres de la route.
    private _userService: UserService, // Service pour les opérations sur les utilisateurs.
    private _router: Router, // Service pour la navigation.
  ) {
    // Récupération de l'identifiant de l'utilisateur à partir des paramètres de la route.
    let userId = +this._activeRoute.snapshot.params['id'];
    
    // Appel au service pour obtenir les détails de l'utilisateur spécifié.
    this._userService.getById(userId).subscribe({
      next: (response) => {
        // Stockage des détails de l'utilisateur dans la propriété readUser.
        this.readUser = response;
        console.log("Récupération de l'utilisateur : ", response);
      },
      error: (error) => {
        // Gestion des erreurs et redirection si l'utilisateur n'est pas trouvé.
        console.error("Erreur lors de la recuperation de l'utilisateur : ", error);
        this._router.navigateByUrl('/not-found');
      },
      complete: () => {
        // Message de confirmation une fois la récupération terminée.
        console.log("Récupération de l'utilisateur terminée");
      }
    });
  }
}
