import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUser, ListUser, ReadUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _url: string = "https://localhost:7272/api/User";


  constructor(private _httpClient: HttpClient) { }

  getAll() : Observable<ListUser[]> {
    return this._httpClient.get<ListUser[]>(`${this._url}`);	
  }

  getById(id : number) : Observable<ReadUser> {
    return this._httpClient.get<ReadUser>(`${this._url}/${id}`);
  }

  delete(id : number) : Observable<CreateUser> {
    return this._httpClient.delete<CreateUser>(`${this._url}/${id}`);
  }
}
