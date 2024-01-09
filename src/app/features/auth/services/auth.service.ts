import { Injectable } from '@angular/core';
import { CreateUser, ReadUser } from '../../user/models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/auth';
import { tap } from 'rxjs/operators';
import { UserService } from '../../user/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _url: string = "https://localhost:7272/api/Auth/Login";

  private _$connectedUser: BehaviorSubject<ReadUser | undefined> = new BehaviorSubject<ReadUser | undefined>(undefined);

  private _connectedUser: CreateUser | undefined = this.getUser();

  $connectedUser: Observable<ReadUser | undefined> = this._$connectedUser.asObservable();

  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService
    ) { }

  login(login: Login): Observable<ReadUser | undefined> {
    if (localStorage.getItem('money-tracker-token')) 
    {
      localStorage.removeItem('money-tracker-token');
    }

    this._httpClient.post<any>(this._url, login).subscribe({
      next: (response) => {
        // Stocker le token
        console.log("Token :", response.accessToken);
        console.log(response)
        localStorage.setItem("money-tracker-token", response.accessToken.replace('Bearer ', ''));
        

        // Récupérer les informations supplémentaires de l'utilisateur
        this._userService.getById(response.id).subscribe({
          next: (response) => {
            this._$connectedUser.next(response);
            console.log("Utilisateur connecté :", response);
          },
          error: (error) => {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
          }
        });
      },
      error: (error) => {
        console.error("Erreur lors de la connexion :", error);
      }
    });

    return this.$connectedUser;
  }

  logout(): void {
    localStorage.removeItem('money-tracker-token');
    this._$connectedUser.next(undefined);
    this._connectedUser = undefined;
  }

  getUser(): CreateUser | undefined {
    return this._connectedUser;
  }
}