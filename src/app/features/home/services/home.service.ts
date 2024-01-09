import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddUserToHome, CreateHome, ListHome, ReadHome, UpdateHome } from '../models/home';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private _url: string = "https://localhost:7272/api/Home";


  constructor(private _httpClient: HttpClient) { }

  getAll() : Observable<ListHome[]> {
    return this._httpClient.get<ListHome[]>(`${this._url}`);	
  }

  getById(id : number) : Observable<ReadHome> {
    return this._httpClient.get<ReadHome>(`${this._url}/${id}`);
  }

  create(createHome : CreateHome): Observable<CreateHome> {
    return this._httpClient.post<CreateHome>(`${this._url}`, createHome);
  }

  update(id : number, updateHome : UpdateHome) : Observable<UpdateHome> {
    return this._httpClient.put<UpdateHome>(`${this._url}/${id}`, updateHome);
  }

  delete(id : number) : Observable<CreateHome> {
    return this._httpClient.delete<CreateHome>(`${this._url}/${id}`);
  }

  addUserToHome(addUserToHome : AddUserToHome) : Observable<AddUserToHome> {
    return this._httpClient.post<AddUserToHome>(`${this._url}/AddUserToHome`, addUserToHome);
  }
}
