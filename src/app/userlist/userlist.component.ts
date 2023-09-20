import { Component, OnInit } from '@angular/core';
import { UserDetailsService } from '../services/user-details.service';
import { User } from '../interfaces/user';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit{
  userList: User[] = [];
  userListFilter:User[] = [];
  start: number = 0;
  end: number = 10;
  activePage: number = 0;
  pages: number[] = [];
  totalPages: number = 0;
  filterForm!: FormGroup;
  constructor(public userDetailsService: UserDetailsService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      userName: this.fb.array([this.fb.group({ value: [''], operation: ['equal'] })]),
      phoneNo: this.fb.array([this.fb.group({ value: [''], operation: ['equal'] })]),
      emailID: this.fb.array([this.fb.group({ value: [''], operation: ['equal'] })]),
    })
  }

  ngOnInit(): void {
    if(this.userDetailsService.userList.length == 0) {
    this.userDetailsService.getUserList().subscribe(() => {
      this.userList = this.userDetailsService.userList;
      this.userListFilter = [...this.userList];
      this.pages = Array.from(Array(Math.min(Math.ceil(this.userList.length / 10), 5)).keys());
      this.totalPages = Math.ceil(this.userList.length / 10);
    });
  }
  else {
    this.userList = this.userDetailsService.userList;
    this.userListFilter = [...this.userList];
    this.pages = Array.from(Array(Math.min(Math.ceil(this.userList.length / 10), 5)).keys());
    this.totalPages = Math.ceil(this.userList.length / 10);

  }
  }

  onPageChange(index: number) {
    this.activePage = index;
    this.start = index * 10;
    this.end = index * 10 + 10;
    const pages = [];
    let startPage = Math.max(0, index - 2);
    let endPage;
    if ((index + 2) < this.totalPages)
      endPage = startPage + 4;
    else {
      endPage = this.totalPages - 1;
      startPage = Math.max(0, endPage - 4);
    }
    for (let i = startPage; i <= endPage && i < this.totalPages; i++)
      pages.push(i);
    this.pages = pages;
  }

  checkPage(n: number): boolean {
    return !(this.pages.includes(n));
  }

  get userName(): FormArray {
    return this.filterForm.get("userName") as FormArray
  }

  get phoneNo(): FormArray {
    return this.filterForm.get("phoneNo") as FormArray
  }

  get emailID(): FormArray {
    return this.filterForm.get("emailID") as FormArray
  }

  remove(formName: string, index: number) {
    if (formName === 'userName')
      this.userName.removeAt(index);
    if (formName === 'phoneNo')
      this.phoneNo.removeAt(index);
    if (formName == 'emailID')
      this.emailID.removeAt(index);
  }

  add(formName: string) {
    if (formName === 'userName')
      this.userName.push(this.fb.group({ value: [''], operation: ['equal'] }));
    if (formName === 'phoneNo')
      this.phoneNo.push(this.fb.group({ value: [''], operation: ['equal'] }));
    if (formName == 'emailID')
      this.emailID.push(this.fb.group({ value: [''], operation: ['equal'] }));
  }

  applyFilter(){
    let filterresult = [...this.userList];
    
    filterresult = filterresult.filter((value,key)=>{
    return (this.filtered(this.emailID.value,value.emailID.toString()) 
    && this.filtered(this.phoneNo.value,value.phoneNo.toString()) 
    && this.filtered(this.userName.value,value.userName.toString()))  
  });
  this.userListFilter = filterresult;
  this.start = 0;
  this.end = 10;
  this.totalPages = Math.ceil(this.userListFilter.length / 10);
  this.activePage = 0;
  this.onPageChange(0);
}

  filtered(filters:any,value:String) {
    var ans = false;
    var oper = false;
    for(var filter of filters) {
      if(filter.value=="")
      continue;
      if(filter.operation == "equal")
      ans = ans || value==filter.value;
      if(filter.operation == "notequal")
      ans = ans || value!=filter.value;
      if(filter.operation == "contains")
      ans = ans || value.includes(filter.value);
      if(filter.operation == "notcontains")
      ans = ans || !value.includes(filter.value);
      oper=true;
    }
    if(oper)
    return ans;
    else
    return true;

  }

  clearFilter() {
    this.userName.clear();
    this.emailID.clear();
    this.phoneNo.clear();
    this.add('userName');
    this.add('phoneNo');
    this.add('emailID');
    this.userListFilter = [...this.userList];
    this.pages = Array.from(Array(Math.min(Math.ceil(this.userListFilter.length / 10), 5)).keys());
    this.totalPages = Math.ceil(this.userListFilter.length / 10);
    this.activePage = 0;
    this.onPageChange(0);
    this.start = 0;
    this.end = 10;
  }

  deleteUser(index:number) {
    var n = 0;
    index=index+this.start;
    for(let [i,v] of this.userList.entries()) {
      if(v == this.userListFilter[index])
      {
        n=i;
        break;
      }
    }
    this.userListFilter.splice(index,1);
    this.userList = this.userDetailsService.deleteUser(n);
    this.totalPages = Math.ceil(this.userListFilter.length / 10);
    if(this.activePage>=(this.totalPages))
    this. onPageChange(this.activePage-1);
  else
    this. onPageChange(this.activePage);

  }

  getIndex(index:number):number {
    var n = 0;
    for(let [i,v] of this.userList.entries()) {
      if(v == this.userListFilter[index])
      {
        n=i;
        break;
      }
    }
    return n;
  }

}

