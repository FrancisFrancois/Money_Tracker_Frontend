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
  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService,
    ) { }

    
  // Méthode helper pour obtenir les informations de l'utilisateur connecté actuel.
  getUser(): ReadUser | undefined {
    return this._connectedUser;
  }

    //TODO : 
    // au login, rajouter dans le local storage l'id
    // ici, récupérer cet id
    // faire une requête pour avoir les infos de l'utilisateur et mettre à jour ton $connectedUser
  getUserById(): void {
    const userId = localStorage.getItem('money-tracker-user-id');
    if(!userId){
      console.error('User id not found');
      return undefined;
    }
    this._userService.getById(parseInt(userId)).subscribe({
      next : (response) => {
        this._connectedUser = response;
        this._$connectedUser.next(response);
      },
      error : (error) => {
        console.error("Erreur lors de la recuperation de l'utilisateur : ", error);
      },
      complete : () => {
        console.log("Récupération de l'utilisateur terminée");
      }
    })
  }

  // Méthode pour gérer le processus de connexion.
  login(login: Login): Observable<ReadUser | undefined> {
    // Suppression du token JWT existant avant la nouvelle connexion.
    if (localStorage.getItem('money-tracker-token')) {
      localStorage.removeItem('money-tracker-token');
    }

    // Envoi de la demande de connexion à l'API et gestion de la réponse.
    this._httpClient.post<any>(this._urlLogin, login).subscribe({
      next: (response) => {
        // Stockage du token JWT dans localStorage après la connexion réussie.
        console.log("Token :", response.accessToken);
        console.log(response)
        console.log("User :", response.user.id);
        localStorage.setItem("money-tracker-token", response.accessToken.replace('Bearer ', ''));
        localStorage.setItem("money-tracker-user-id", response.user.id.toString());
        
        // Récupération des informations de l'utilisateur connecté via UserService.
        this._userService.getById(response.user.id).subscribe({
          next: (response) => {
            // Mise à jour du BehaviorSubject avec les informations de l'utilisateur connecté.
            this._$connectedUser.next(response);
            console.log("Utilisateur connecté :", response);
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

    // Retour d'un Observable permettant aux composants de s'abonner à l'utilisateur connecté.
    return this.$connectedUser;
  }

  // Méthode pour gérer le processus de déconnexion.
  logout(): void {
    // Suppression du token JWT de localStorage et réinitialisation de l'utilisateur connecté.
    localStorage.removeItem('money-tracker-token');
    this._$connectedUser.next(undefined);
    this._connectedUser = undefined;
  }

  register(register: Register): Observable<Register | undefined> {
    return this._httpClient.post<Register>(this._urlRegister, register);
  }

}
