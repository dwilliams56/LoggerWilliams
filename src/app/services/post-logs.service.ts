import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface BookMark{
  Id: number,
  UserID: number,
  LogID: number
}

@Injectable({
  providedIn: 'root'
})

export class PostLogsService {
  private url = "https://api.jsonbin.io/b/6250885bd20ace068f959856/17";
  headers = { headers: new Headers({ 'Content-Type': 'application/json' })};
  token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJoZWxsbzEiLCJqdGkiOiI0NGQ2NGQzMy1iM2ZmLTRiMDYtODgyMS1kYjUyNzVmZjJkZjYiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiaGVsbG8xIiwibmJmIjoxNjUxNTQxNDI3LCJleHAiOjE2NTE4MDA2MjcsImF1ZCI6IlJlbW90ZUxvZ2dlclVzZXJzIn0.nfGJdEn7dMD39cze_58gB5-4k2JA229aVDEo98R12R7nQF-bbFZHO7fVpYojX6ZBnws_R_yJDYN8MByLsfTsVg';
  token2 = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJoZWxsbzEiLCJqdGkiOiI0NGQ2NGQzMy1iM2ZmLTRiMDYtODgyMS1kYjUyNzVmZjJkZjYiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiaGVsbG8xIiwibmJmIjoxNjUxNTQxNDI3LCJleHAiOjE2NTE4MDA2MjcsImF1ZCI6IlJlbW90ZUxvZ2dlclVzZXJzIn0.nfGJdEn7dMD39cze_58gB5-4k2JA229aVDEo98R12R7nQF-bbFZHO7fVpYojX6ZBnws_R_yJDYN8MByLsfTsVg';
  
  constructor(private http: HttpClient) { }

  /** Get All Logs */

  getLogs(){
    //returns observable
    const headers = { 'content-type': 'application/json'}  
    return this.http.get("https://localhost:5001/api/DatabaseLogs/GetAllDatabaseLogs", {'headers': headers});

  }

  setJwtToken(){
    
  }

  /** Get Token  */

  getJwtToken(){
    var jsonToken = JSON.parse(atob(this.token.split('.')[1]));
    return this.token2;
  }
  
  /** Delete Selected Logs */

  deleteLogs(id: any[]){
    const headers = { 'content-type': 'application/json'}
    console.log("https://localhost:5001/api/DatabaseLogs/DeleteDatabaseLog?LogID="+ id);
    for( let i=0; i < id.length; i++){
    this.http.delete("https://localhost:5001/api/DatabaseLogs/DeleteDatabaseLog?LogID="+ id[i], {'headers': headers}).subscribe( (response) =>
    {console.log(response);
    });
    }
   }

  getUserBookmarks(){
    const headers = { 'content-type': 'application/json'}
    return this.http.get("https://localhost:5001/api/Bookmark/GetAllBookmarks", {'headers': headers});
  }

  /** Add User Bookmarks */

  addUserBookmarks(bookMark: BookMark){
    const headers = { 'content-type': 'application/json'} 
    console.log(bookMark);
    var book = JSON.stringify(bookMark) 
    return this.http.post("https://localhost:5001/api/Bookmark/AddBookmark", book, {'headers': headers}).subscribe((response) =>
    { console.log(response);
    });
  }

  /**  Login Method -- Returns JWT */
  userLogin(user: string, password: string){
    const headers = { 'content-type': 'application/json'} 
    var body = JSON.stringify({ UserName: user, Password: password });
    console.log(body);
    return this.http.post("https://localhost:5001/api/User/login", body, {'headers': headers}).subscribe((response) =>
    { console.log(response);
    });
  }
}