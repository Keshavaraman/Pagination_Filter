import { Component, Input, OnInit } from '@angular/core';
import {UserDetailsService} from "../services/user-details.service";
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../interfaces/user';
import { FormBuilder, FormGroup } from '@angular/forms';


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
  constructor(private userDetailsService:UserDetailsService,private route:ActivatedRoute,private fb: FormBuilder,private router:Router) { 
    
  }

  ngOnInit(): void {
    this.index = this.route.snapshot.params['userID'];
    this.userDetails = {...this.userDetailsService.userList[this.index]};
    this.userForm = this.fb.group({
      userName:[this.userDetails.userName],
      phoneNo:[this.userDetails.phoneNo],
      emailID:[this.userDetails.emailID]
    })
    this.updateView=false;
  }

  toggleView() {
    this.updateView = !this.updateView;
  }

  updateUser() {
    let updatedIndex = this.userDetailsService.updateUser(this.index,this.userForm.value);
    this.router.navigate(["/user",updatedIndex]);
    this.userDetails = {...this.userDetailsService.userList[updatedIndex]};
    this.updateView=false;
  }
}
