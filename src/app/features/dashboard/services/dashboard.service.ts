import { Injectable } from '@angular/core';
import { Expense } from '../models/dashboard';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private _url: string = "https://localhost:7272/api/Expense";


  constructor(private _httpClient: HttpClient) { }

  getExpensesByDay(dateString: string, homeId?: number, userId?: number, categoryId?: number): Observable<Expense[]> {
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

    return this._httpClient.get<Expense[]>(`${this._url}/ExpensesByDay`, { params });
  }

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
