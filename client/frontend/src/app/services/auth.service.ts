import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl:any='http://localhost:5000/users'
  constructor(private http:HttpClient) { }


  registerForm(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/register`,data)
   }

  loginForm(data:any):Observable<any>{
   return this.http.post(`${this.baseUrl}/login`,data)
  }

  getAllData():Observable<any>{
  return this.http.get(`${this.baseUrl}/getAllData`)
  }

  getDataById(id:any){
    return this.http.get(`${this.baseUrl}/getDataById/`+id)
  }
}
