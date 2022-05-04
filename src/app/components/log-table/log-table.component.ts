import { PostLogsService } from './../../services/post-logs.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDatepicker } from '@angular/material/datepicker';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

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

export interface Log{
  logID: number,
  application: string,
  applicationVersion: string,
  userID: number,
  companyID: number,
  logDateTime: string,
  logContent: string,
  noteContent: string
}

@Component({
  selector: 'log-table',
  templateUrl: './log-table.component.html',
  styleUrls: ['./log-table.component.css']
})
export class LogTableComponent implements OnInit, AfterViewInit {
  color = "black";
  logTabs: string[] = ['dashboard', 'Bookmarked','Recent'];
  displayedColumns: string[] = ['Select','LogID','Application', 'ApplicationVersion', 'UserID', 'CompanyID','LogDateTime','LogContent','Actions'];
  dataSource = new MatTableDataSource<Log>([]);
  copyDataSource = new MatTableDataSource<Log>([]);
  bookmarkDataSource = new MatTableDataSource<getBookMark>([]);
  clickedRows = new Set<Log>();
  bookmarked: number[] = [];
  selection = new SelectionModel<Log>(true, []);

  private startDate = new Date();
  private endDate = new Date();

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  constructor(private service: PostLogsService ) {}

  ngOnInit(): void {
    this.fetchLogs();
    this.fetchBookmarks();
  }

  fetchLogs(): void {
    this.service.getLogs().subscribe((data) => {
      this.dataSource.data = data as Log[];
    });
    this.service.getLogs().subscribe((data) => {
      this.copyDataSource.data = data as Log[];
    });
  }

  fetchBookmarks(): void {
    this.service.getUserBookmarks().subscribe((data) => {
      this.bookmarkDataSource.data = data as getBookMark[];
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  refresh(){
    this.dataSource._updateChangeSubscription();
    this.ngAfterViewInit();
  }

  refreshBookmarks(){
    this.bookmarkDataSource._updateChangeSubscription();
    this.bookmarkDataSource.data = this.bookmarkDataSource.data;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //SELECT
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Log): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.logID + 1}`;
  }

  /** RangePicker, Methods for Date Range */

  getStartDate(){
    return this.startDate;
  }
  setStartDate(date: Date){
    this.startDate = date;
  }

  getEndDate(){
    return this.endDate;
  }
  setEndDate(date: Date){
    this.endDate = date;
  }

  applyDateRangeFilter(start: Date, end: Date){
    var startDate = (start.toISOString);
    var endDate = (end.toISOString);
    this.dataSource.data = this.copyDataSource.data.filter(e=>(new Date(e.logDateTime))  >= start && (new Date(e.logDateTime) <= end));
    console.log(start, end);
    

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  fromTime(type: any, event: any){
    var fromTime = event.value;
    this.setStartDate(fromTime);
  }

  toTime(type: any, event: any){
    var toTime = event.value;
    this.setEndDate(toTime);
  }

  /** SaveUserBookMark */

  saveUserBookmark(){
    var log: Log[] = this.dataSource.data;
    var bookmark: postBookMark = {Id : 0, UserID : 0, LogID: 5};//Need to retrieve LogID
    var bookmarks: getBookMark[] = this.bookmarkDataSource.data; 
    var userIDtoken = this.service.getJwtToken(); //Gets  UserID from JWT token.
    var userID  = this.setUserId();
    for (let i = 0; i < bookmarks.length; i++){
      if (bookmark.LogID != bookmarks[i].logID && bookmark.UserID == bookmarks[i].userID){
        this.service.addUserBookmarks(bookmark);
        i = (bookmarks.length) - 1
      }
      else if(bookmark.LogID == bookmarks[i].logID && bookmark.UserID != bookmarks[i].userID){
        this.service.addUserBookmarks(bookmark);
        i = (bookmarks.length) - 1
      }
      else if(bookmark.LogID != bookmarks[i].logID && bookmark.UserID != bookmarks[i].userID){
        this.service.addUserBookmarks(bookmark);
        i = (bookmarks.length) - 1
      }
      else {
        console.log("Already in system");
      }

      this.refreshBookmarks();

    }
    
    
  }

  setUserId(){
    var token = this.service.getJwtToken();
    var userID: number;
    var tokenParse = JSON.parse(atob(token.split('.')[1]));
    userID = (tokenParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
    console.log(userID);
    return(userID);
  }

  /** DeleteLogs */

  deleteSelected(){
    var selectedLogs = [];
    var id = [];
    var size;
    var sortedId = [];
    var copy: Log[] = this.copyDataSource.data;
    let j = 0;
    selectedLogs = this.selection.selected;
    console.log(this.selection.select);
    console.log(selectedLogs);
    size = selectedLogs.length
    for(let i = 0; i < size ; i++){
      id[i] = (selectedLogs[i].logID)
    }

    sortedId = id.sort((n1,n2) => n1 - n2);
    
    for(let i = 0; i < copy.length; i++){
      console.log(copy[i].logID + "i(outer)");
      console.log(sortedId[j] + "j(outer)");
      if(copy[i].logID == sortedId[j]){
        console.log(copy[i].logID + "i(inner)");
        console.log(sortedId[j]+ "j(inner)");
        this.dataSource.data.splice(i , sortedId.length);
        console.log(copy[i]);
        j = j + 1; 
      }
      
    }

    this.service.deleteLogs(sortedId);
    this.refresh();
  }
}
