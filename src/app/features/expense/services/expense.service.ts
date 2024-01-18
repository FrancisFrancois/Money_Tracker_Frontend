import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateExpense, ListExpense, ReadExpense, UpdateExpense } from '../models/expense';


@Injectable({
  providedIn: 'root' // Indique que le service est disponible globalement dans l'application.
})
export class ExpenseService {


  private _url: string = "https://localhost:7272/api/Expense";

  // Constructeur pour injecter le service HttpClient d'Angular.
  constructor(private _httpClient: HttpClient) { }

  // Méthode pour obtenir toutes les dépenses. 
  getAll() : Observable<ListExpense[]> {
    return this._httpClient.get<ListExpense[]>(`${this._url}`);
  }

  // Méthode pour obtenir une dépense par son identifiant. 
  getById(id : number) : Observable<ReadExpense> {
    return this._httpClient.get<ReadExpense>(`${this._url}/${id}`);
  }

  // Méthode pour créer une nouvelle dépense. 
  create(createExpense : CreateExpense): Observable<CreateExpense> {
    return this._httpClient.post<CreateExpense>(`${this._url}`, createExpense);
  }

  // Méthode pour mettre à jour une dépense existante. 
  update(id : number, updateExpense : UpdateExpense) : Observable<UpdateExpense> {
    return this._httpClient.put<UpdateExpense>(`${this._url}/${id}`, updateExpense);
  }

  // Méthode pour supprimer une dépense par son identifiant.
  delete(id : number) : Observable<CreateExpense> {
    return this._httpClient.delete<CreateExpense>(`${this._url}/${id}`);
  }
}
