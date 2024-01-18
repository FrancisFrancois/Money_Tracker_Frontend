import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddUserToHome, CreateHome, ListHome, ReadHome, UpdateHome } from '../models/home';

@Injectable({
  providedIn: 'root' 
})
export class HomeService {

  // URL de base pour les requêtes API concernant les maisons.
  private _url: string = "https://localhost:7272/api/Home";

  // Constructeur pour injecter le service HttpClient d'Angular.
  constructor(private _httpClient: HttpClient) { }

  // Méthode pour obtenir toutes les maisons
  getAll(): Observable<ListHome[]> {
    return this._httpClient.get<ListHome[]>(`${this._url}`);
  }

  // Méthode pour obtenir une maison par son identifiant
  getById(id: number): Observable<ReadHome> {
    return this._httpClient.get<ReadHome>(`${this._url}/${id}`);
  }

  // Méthode pour créer une nouvelle maison
  create(createHome: CreateHome): Observable<CreateHome> {
    return this._httpClient.post<CreateHome>(`${this._url}`, createHome);
  }

  // Méthode pour mettre à jour une maison existante
  update(id: number, updateHome: UpdateHome): Observable<UpdateHome> {
    return this._httpClient.put<UpdateHome>(`${this._url}/${id}`, updateHome);
  }

  // Méthode pour supprimer une maison par son identifiant
  delete(id: number): Observable<CreateHome> {
    return this._httpClient.delete<CreateHome>(`${this._url}/${id}`);
  }

  // Méthode pour ajouter un utilisateur à une maison
  addUserToHome(addUserToHome: AddUserToHome): Observable<AddUserToHome> {
    return this._httpClient.post<AddUserToHome>(`${this._url}/AddUserToHome`, addUserToHome);
  }

  // Méthode pour supprimer un utilisateur d'une maison
  deleteUserFromHome(homeId: number, userId: number): Observable<AddUserToHome> {
    return this._httpClient.delete<AddUserToHome>(`${this._url}/DeleteUserFromHome/${homeId}/${userId}`);
  }
}
