import { Injectable } from '@angular/core';
import { ReadUser } from '../../user/models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Login, Register } from '../models/auth';
import { UserService } from '../../user/services/user.service';

// Décorateur qui marque 'AuthService' comme un service injectable.
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL de l'API pour la connexion.
  private _urlLogin: string = "https://localhost:7272/api/Auth/Login";
  // URL de l'API pour l'inscription.
  private _urlRegister: string = "https://localhost:7272/api/Auth/Register";

  // BehaviorSubject pour stocker et observer les changements de l'utilisateur connecté.
  private _$connectedUser: BehaviorSubject<ReadUser | undefined> = new BehaviorSubject<ReadUser | undefined>(undefined);

  // Variable pour conserver l'état de l'utilisateur connecté.
  private _connectedUser: ReadUser | undefined = this.getUser();

  // Observable public pour permettre aux composants de s'abonner aux changements de l'utilisateur connecté.
  $connectedUser: Observable<ReadUser | undefined> = this._$connectedUser.asObservable();

  // BehaviorSubject pour stocker et observer les erreurs de connexion.
  private _$errorConnection :BehaviorSubject<string|undefined> = new BehaviorSubject<string|undefined>(undefined);

  // Observable public pour permettre aux composants de s'abonner aux erreurs de connexion.
  $errorConnection :Observable<string|undefined> = this._$errorConnection.asObservable();

  // Constructeur pour injecter HttpClient et UserService.
  constructor(private _httpClient: HttpClient, private _userService: UserService) { }

  // Méthode helper pour obtenir les informations de l'utilisateur connecté actuel.
  getUser(): ReadUser | undefined {
    return this._connectedUser;
  }

// Méthode pour récupérer l'utilisateur par son ID après la connexion.
getUserById(): void {
  // Récupère l'ID de l'utilisateur depuis le stockage local.
  const userId = localStorage.getItem('money-tracker-user-id');
  // Vérifie si l'ID de l'utilisateur existe.
  if(!userId){
    console.error('User id not found');
    return undefined;
  }
  // Utilise le service 'UserService' pour récupérer les informations de l'utilisateur par ID.
  this._userService.getById(parseInt(userId)).subscribe({
    next : (response) => {
      // Met à jour les informations de l'utilisateur connecté.
      this._connectedUser = response;
      // Notifie les abonnés du changement de l'utilisateur connecté.
      this._$connectedUser.next(response);
    },
    error : (error) => {
      // Gestion des erreurs lors de la récupération de l'utilisateur.
      console.error("Erreur lors de la recuperation de l'utilisateur : ", error);
    },
    complete : () => {
      // Log lorsque la récupération de l'utilisateur est terminée.
      console.log("Récupération de l'utilisateur terminée");
    }
  })
}


 // Méthode pour gérer le processus de connexion.
login(login: Login): Observable<ReadUser | undefined> {
  // Vérifie si un token existe déjà dans le stockage local et le supprime le cas échéant.
  if (localStorage.getItem('money-tracker-token')) {
    localStorage.removeItem('money-tracker-token');
  }

  // Effectue une requête POST avec les informations de connexion.
  this._httpClient.post<any>(this._urlLogin, login).subscribe({
    next: (response) => {
      // Stocke le token JWT et l'ID de l'utilisateur dans le stockage local.
      localStorage.setItem("money-tracker-token", response.accessToken.replace('Bearer ', ''));
      localStorage.setItem("money-tracker-user-id", response.user.id.toString());

      // Récupère les informations complètes de l'utilisateur connecté.
      this._userService.getById(response.user.id).subscribe({
        next: (response) => {
          // Met à jour les informations de l'utilisateur connecté.
          this._$connectedUser.next(response);
        },
        error: (error) => {
          // Gestion des erreurs lors de la récupération des informations de l'utilisateur.
          console.error("Erreur lors de la récupération de l'utilisateur :", error);
        }
      });
    },
    error: (error) => {
      // Gestion des erreurs lors de la tentative de connexion.
      console.error("Erreur lors de la connexion :", error);
    }
  });

  // Retourne un Observable pour permettre l'abonnement aux changements de l'utilisateur connecté.
  return this.$connectedUser;
}

// Méthode pour gérer le processus de déconnexion.
logout(): void {
  // Supprime le token JWT du stockage local.
  localStorage.removeItem('money-tracker-token');
  // Réinitialise les informations de l'utilisateur connecté.
  this._$connectedUser.next(undefined);
  this._connectedUser = undefined;
}

// Méthode pour gérer le processus d'inscription.
register(register: Register): Observable<Register | undefined> {
  // Envoie une requête POST pour enregistrer un nouvel utilisateur.
  return this._httpClient.post<Register>(this._urlRegister, register);
}

}
