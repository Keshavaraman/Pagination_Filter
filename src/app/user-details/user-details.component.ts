import { Component, Input, OnInit } from '@angular/core';
import {UserDetailsService} from "../services/user-details.service";
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../interfaces/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  index:number = 0;
  userDetails!:User;
  userForm!: FormGroup;
  updateView!:boolean;
  valideForm:boolean = true;
  constructor(private userDetailsService:UserDetailsService,private route:ActivatedRoute,private fb: FormBuilder,private router:Router) { 
    
  }

  ngOnInit(): void {
    this.index = this.route.snapshot.params['userID'];
    this.userDetails = {...this.userDetailsService.userList[this.index]};
    this.userForm = this.fb.group({
      userName:[this.userDetails.userName,Validators.compose([Validators.pattern('[a-zA-Z ]+')])],
      phoneNo:[this.userDetails.phoneNo,Validators.compose([Validators.pattern('[0-9]{10}')])],
      emailID:[this.userDetails.emailID,Validators.compose([Validators.pattern("[a-zA-Z0-9.**-**_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}")])]
    })
    this.updateView=false;
  }

  toggleView() {
    this.updateView = !this.updateView;
  }

  updateUser() {
    if(this.userForm.invalid) {
      this.valideForm = false;
      return;
    }
    this.valideForm = true;
    let updatedIndex = this.userDetailsService.updateUser(this.index,this.userForm.value);
    this.index = updatedIndex;
    this.userDetails = {...this.userDetailsService.userList[updatedIndex]};
    this.updateView=false;
  }
}
