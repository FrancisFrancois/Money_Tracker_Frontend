import { Injectable } from '@angular/core';
import { ExpenseByDay } from '../models/dashboard';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private _url: string = "https://localhost:7272/api/Expense";


  constructor(private _httpClient: HttpClient) { }

  getExpensesByDay(dateString: string, homeId?: number, userId?: number, categoryId?: number): Observable<ExpenseByDay[]> {
    const queryParams = `dateString=${encodeURIComponent(dateString)}${homeId ? `&homeId=${homeId}` : ''}${userId ? `&userId=${userId}` : ''}${categoryId ? `&categoryId=${categoryId}` : ''}`;
    return this._httpClient.get(`${this._url}/ExpensesByDay?${queryParams}`) as Observable<ExpenseByDay[]>;
  }
}
