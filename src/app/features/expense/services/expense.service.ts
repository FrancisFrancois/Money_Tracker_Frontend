import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateExpense, ListExpense, ReadExpense, UpdateExpense } from '../models/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private _url: string = "https://localhost:7272/api/Expense";


  constructor(private _httpClient: HttpClient) { }

  getAll() : Observable<ListExpense[]> {
    return this._httpClient.get<ListExpense[]>(`${this._url}`);	
  }

  getById(id : number) : Observable<ReadExpense> {
    return this._httpClient.get<ReadExpense>(`${this._url}/${id}`);
  }

  create(createExpense : CreateExpense): Observable<CreateExpense> {
    return this._httpClient.post<CreateExpense>(`${this._url}`, createExpense);
  }

  update(id : number, updateExpense : UpdateExpense) : Observable<UpdateExpense> {
    return this._httpClient.put<UpdateExpense>(`${this._url}/${id}`, updateExpense);
  }

  delete(id : number) : Observable<CreateExpense> {
    return this._httpClient.delete<CreateExpense>(`${this._url}/${id}`);
  }
}
