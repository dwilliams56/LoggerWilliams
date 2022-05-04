import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface postBookMark{
  Id: number,
  UserID: number,
  LogID: number
}

export interface getBookMark{
  bookmarkID: number,
  userID: number,
  logID: number
}

@Injectable({
  providedIn: 'root'
})

export class PostLogsService {
  private url = "https://api.jsonbin.io/b/6250885bd20ace068f959856/17";
  headers = { headers: new Headers({ 'Content-Type': 'application/json' })};
  private token: string = "";
  
  constructor(private http: HttpClient) { }

  /** Get All Logs */

  getLogs(){
    //returns observable
    const headers = { 'content-type': 'application/json'}  
    console.log("get");
    return this.http.get("https://localhost:5001/api/DatabaseLogs/GetAllDatabaseLogs", {'headers': headers});

  }

  setJwtToken(jwt: any){
    var jsonToken: any;
    this.token = jsonToken = JSON.parse(atob(this.token.split('.')[1]));

  }

  /** Get Token  */

  getJwtToken(){
    return this.token;
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

  addUserBookmarks(bookMark: postBookMark){
    const headers = { 'content-type': 'application/json'} 
    console.log(bookMark + "addUser");
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