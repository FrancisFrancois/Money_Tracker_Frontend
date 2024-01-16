import { HttpClient } from '@angular/common/http'; 
import { Injectable } from '@angular/core'; 
import { Observable } from 'rxjs'; 
import { CreateCategory, ListCategory, ReadCategory, UpdateCategory } from '../models/category'; 

@Injectable({
  providedIn: 'root' // Indique que ce service est disponible dans toute l'application
})
export class CategoryService {

  private _url: string = "https://localhost:7272/api/Category"; // Définit l'URL de base de l'API des catégories

  constructor(private _httpClient: HttpClient) { } // Le constructeur injecte le service HttpClient pour les requêtes HTTP

  // Méthode pour récupérer toutes les catégories
  getAll() : Observable<ListCategory[]> {
    return this._httpClient.get<ListCategory[]>(`${this._url}`);
  }

  // Méthode pour récupérer une catégorie par son ID
  getById(id : number) : Observable<ReadCategory> {
    return this._httpClient.get<ReadCategory>(`${this._url}/${id}`);
  }

  // Méthode pour créer une nouvelle catégorie
  create(createUser : CreateCategory): Observable<CreateCategory> {
    return this._httpClient.post<CreateCategory>(`${this._url}`, createUser);
  }

  // Méthode pour mettre à jour une catégorie existante
  update(id : number, updateUser : UpdateCategory) : Observable<UpdateCategory> {
    return this._httpClient.put<UpdateCategory>(`${this._url}/${id}`, updateUser);
  }

  // Méthode pour supprimer une catégorie par son ID
  delete(id : number) : Observable<CreateCategory> {
    return this._httpClient.delete<CreateCategory>(`${this._url}/${id}`);
  }
}
