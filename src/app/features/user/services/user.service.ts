import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUser, ListUser, ReadUser, UpdateUser } from '../models/user';


@Injectable({
  providedIn: 'root' 
})
export class UserService {

  // URL de base pour les requêtes API concernant les utilisateurs.
  private _url: string = "https://localhost:7272/api/User";

  // Constructeur pour injecter le service HttpClient d'Angular.
  constructor(private _httpClient: HttpClient) { }

  // Méthode pour obtenir tous les utilisateurs. 
  getAll(): Observable<ListUser[]> {
    return this._httpClient.get<ListUser[]>(`${this._url}`);	
  }

  // Méthode pour obtenir un utilisateur par son identifiant. 
  getById(id: number): Observable<ReadUser> {
    return this._httpClient.get<ReadUser>(`${this._url}/${id}`);
  }

  // Méthode pour créer un nouvel utilisateur.
  create(createUser: CreateUser): Observable<CreateUser> {
    return this._httpClient.post<CreateUser>(`${this._url}`, createUser);
  }

  // Méthode pour mettre à jour un utilisateur existant. 
  update(id: number, updateUser: UpdateUser): Observable<UpdateUser> {
    return this._httpClient.put<UpdateUser>(`${this._url}/${id}`, updateUser);
  }

  // Méthode pour supprimer un utilisateur par son identifiant. 
  delete(id: number): Observable<CreateUser> {
    return this._httpClient.delete<CreateUser>(`${this._url}/${id}`);
  }
}
