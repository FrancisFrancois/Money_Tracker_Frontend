import { Injectable } from '@angular/core';
import { Expense } from '../models/dashboard';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

// Injectable decorator: Permet d'injecter ce service dans d'autres classes sans avoir besoin d'instancier manuellement.
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // URL de base pour l'API des dépenses.
  private _url: string = "https://localhost:7272/api/Expense";

  // Injecte HttpClient pour effectuer des requêtes HTTP.
  constructor(private _httpClient: HttpClient) { }

  // Méthode pour récupérer les dépenses par jour.
  // dateString: la date pour laquelle récupérer les dépenses.
  // homeId, userId, categoryId sont des paramètres optionnels pour filtrer les dépenses.
  getExpensesByDay(dateString: string, homeId?: number, userId?: number, categoryId?: number): Observable<Expense[]> {
    let params = new HttpParams().set('dateString', dateString);

    // Ajoute des paramètres à la requête si ceux-ci sont fournis.
    if (homeId !== undefined) {
      params = params.append('homeId', homeId.toString());
    }
    if (userId !== undefined) {
      params = params.append('userId', userId.toString());
    }
    if (categoryId !== undefined) {
      params = params.append('categoryId', categoryId.toString());
    }

    // Effectue une requête GET en passant les paramètres, et retourne un Observable de type Expense[].
    return this._httpClient.get<Expense[]>(`${this._url}/ExpensesByDay`, { params });
  }

  // Les méthodes suivantes sont similaires à getExpensesByDay, mais pour différentes période:
  // - getExpensesByWeek: Pour récupérer les dépenses par semaine.
  // - getExpensesByMonth: Pour récupérer les dépenses par mois.
  // - getExpensesByYear: Pour récupérer les dépenses par année.

  // Méthodes pour obtenir le total des dépenses sur différentes périodes:
  // - totalExpensesByDay: Calcule le total des dépenses par jour.
  // - totalExpensesByWeek: Calcule le total des dépenses par semaine.
  // - totalExpensesByMonth: Calcule le total des dépenses par mois.
  // - totalExpensesByYear: Calcule le total des dépenses par année.

  // Note: Chaque méthode utilise HttpClient pour faire une requête GET à l'API,
  // en passant les paramètres appropriés (date, homeId, userId, categoryId).

  getExpensesByWeek(dateString: string, homeId?: number, userId?: number, categoryId?: number): Observable<Expense[]> {
    let params = new HttpParams().set('dateString', dateString);

    if (homeId !== undefined) {
      params = params.append('homeId', homeId.toString());
    }
    if (userId !== undefined) {
      params = params.append('userId', userId.toString());
    }
    if (categoryId !== undefined) {
      params = params.append('categoryId', categoryId.toString());
    }

    return this._httpClient.get<Expense[]>(`${this._url}/ExpensesByWeek`, { params });
  }

  getExpensesByMonth(dateString: string, homeId?: number, userId?: number, categoryId?: number): Observable<Expense[]> {
    let params = new HttpParams().set('dateString', dateString);

    if (homeId !== undefined) {
      params = params.append('homeId', homeId.toString());
    }
    if (userId !== undefined) {
      params = params.append('userId', userId.toString());
    }
    if (categoryId !== undefined) {
      params = params.append('categoryId', categoryId.toString());
    }

    return this._httpClient.get<Expense[]>(`${this._url}/ExpensesByMonth`, { params });
  }

  getExpensesByYear(dateString: string, homeId?: number, userId?: number, categoryId?: number): Observable<Expense[]> {
    let params = new HttpParams().set('dateString', dateString);

    if (homeId !== undefined) {
      params = params.append('homeId', homeId.toString());
    }
    if (userId !== undefined) {
      params = params.append('userId', userId.toString());
    }
    if (categoryId !== undefined) {
      params = params.append('categoryId', categoryId.toString());
    }

    return this._httpClient.get<Expense[]>(`${this._url}/ExpensesByYear`, { params });
  }

  totalExpensesByDay(dateString: string, homeId?: number, userId?: number, categoryId?: number): Observable<Expense[]> {
    let params = new HttpParams().set('dateString', dateString);

    if (homeId !== undefined) {
      params = params.append('homeId', homeId.toString());
    }
    if (userId !== undefined) {
      params = params.append('userId', userId.toString());
    }
    if (categoryId !== undefined) {
      params = params.append('categoryId', categoryId.toString());
    }

    return this._httpClient.get<Expense[]>(`${this._url}/TotalExpenseByDay`, { params });
  }

  totalExpensesByWeek(dateString: string, homeId?: number, userId?: number, categoryId?: number): Observable<Expense[]> {
    let params = new HttpParams().set('dateString', dateString);

    if (homeId !== undefined) {
      params = params.append('homeId', homeId.toString());
    }
    if (userId !== undefined) {
      params = params.append('userId', userId.toString());
    }
    if (categoryId !== undefined) {
      params = params.append('categoryId', categoryId.toString());
    }

    return this._httpClient.get<Expense[]>(`${this._url}/TotalExpenseByWeek`, { params });
  }

  totalExpensesByMonth(dateString: string, homeId?: number, userId?: number, categoryId?: number): Observable<Expense[]> {
    let params = new HttpParams().set('dateString', dateString);

    if (homeId !== undefined) {
      params = params.append('homeId', homeId.toString());
    }
    if (userId !== undefined) {
      params = params.append('userId', userId.toString());
    }
    if (categoryId !== undefined) {
      params = params.append('categoryId', categoryId.toString());
    }

    return this._httpClient.get<Expense[]>(`${this._url}/TotalExpenseByMonth`, { params });
  }

  totalExpensesByYear(dateString: string, homeId?: number, userId?: number, categoryId?: number): Observable<Expense[]> {
    let params = new HttpParams().set('dateString', dateString);

    if (homeId !== undefined) {
      params = params.append('homeId', homeId.toString());
    }
    if (userId !== undefined) {
      params = params.append('userId', userId.toString());
    }
    if (categoryId !== undefined) {
      params = params.append('categoryId', categoryId.toString());
    }

    return this._httpClient.get<Expense[]>(`${this._url}/TotalExpenseByYear`, { params });
  }
}
