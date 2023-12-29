import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateCategory, ListCategory, ReadCategory, UpdateCategory } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private _url: string = "https://localhost:7272/api/Category";


  constructor(private _httpClient: HttpClient) { }

  getAll() : Observable<ListCategory[]> {
    return this._httpClient.get<ListCategory[]>(`${this._url}`);	
  }

  getById(id : number) : Observable<ReadCategory> {
    return this._httpClient.get<ReadCategory>(`${this._url}/${id}`);
  }

  create(createUser : CreateCategory): Observable<CreateCategory> {
    return this._httpClient.post<CreateCategory>(`${this._url}`, createUser);
  }

  update(id : number, updateUser : UpdateCategory) : Observable<UpdateCategory> {
    return this._httpClient.put<UpdateCategory>(`${this._url}/${id}`, updateUser);
  }

  delete(id : number) : Observable<CreateCategory> {
    return this._httpClient.delete<CreateCategory>(`${this._url}/${id}`);
  }
}
