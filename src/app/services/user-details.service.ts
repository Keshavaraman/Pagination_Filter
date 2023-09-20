import { Injectable } from '@angular/core';
import { Observable,tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { UserJsonResponse } from '../interfaces/userJsonResponse';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsService {
  userList: User[]  = [];


  constructor(private http: HttpClient) {
  }

  public getUserList(): Observable<UserJsonResponse> {
    return this.http.get<UserJsonResponse>('./assets/userList.json').pipe(tap((response:UserJsonResponse)=>{this.userList=[...response.userList]}));
  }

  public addUser(user:User):User[] {
    this.userList.push(user);
    for (let i = this.userList.length - 1; i > 0 && this.userList[i].userName < this.userList[i-1].userName; i--) {
        var tmp = this.userList[i];
        this.userList[i] = this.userList[i-1];
        this.userList[i-1] = tmp;
    }
    return this.userList;
  }
  public deleteUser(i:number):User[] {
    this.userList.splice(i,1);
    return this.userList;
  }

  public updateUser(i:number,updatedUser:User){
    
    this.userList.splice(i,1);
    this.userList.push(updatedUser);
    console.log(this.userList);
    var i = this.userList.length - 1;
    
    for (; i > 0 && this.userList[i].userName < this.userList[i-1].userName; i--) {
      var tmp = this.userList[i];
      this.userList[i] = this.userList[i-1];
      this.userList[i-1] = tmp;
  }
    return i;
  }
}
