import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { ReadUser } from 'src/app/features/user/models/user';

// Déclaration du composant avec son sélecteur, son template HTML et son fichier de style CSS.
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  // Propriété privée pour stocker les informations de l'utilisateur connecté.
  private _connectedUser: ReadUser | undefined;

  // Subscription pour suivre les changements de l'utilisateur connecté.
  private _userSub: Subscription = new Subscription();

  // Constructeur pour injecter le service AuthService.
  constructor(private _authService: AuthService) { }

  // Méthode ngOnInit appelée lors de l'initialisation du composant.
  ngOnInit(): void {
    // Souscription au Observable $connectedUser du service AuthService.
    this._userSub = this._authService.$connectedUser.subscribe({
      next: (value) => {
        // Mise à jour de l'utilisateur connecté lorsque le Observable émet une nouvelle valeur.
        this._connectedUser = value;
      }
    });
    // Appel au service AuthService pour obtenir l'utilisateur connecté.
    this._authService.getUserById();
  }

  // Méthode pour vérifier si un utilisateur est connecté.
  isConnected(): boolean {
    return this._connectedUser != undefined;
  }

  // Méthode pour obtenir un affichage formaté de l'utilisateur connecté.
  userDisplay(): string {
    return ` ${this._connectedUser?.firstname}`; 
  }

  // Méthode pour déconnecter l'utilisateur.
  logout(): void {
    this._authService.logout();
  }

  // Méthode ngOnDestroy appelée lors de la destruction du composant.
  ngOnDestroy(): void {
    // Annulation de la souscription pour éviter les fuites de mémoire.
    this._userSub.unsubscribe();
    // Déconnexion de l'utilisateur lors de la destruction du composant.
    this.logout();
  }
}

