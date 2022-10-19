import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!:FormGroup;
  submitted:boolean=false;
  constructor(private fb:FormBuilder,private auth:AuthService,private router:Router) { }

  ngOnInit(): void {
    this.loginForm=this.fb.group({
      email:[''],
      password:['']
    })

  }

  get f(){
    return this.loginForm.controls
  }

  onSubmit(){
    this.submitted=true;
    if(this.loginForm.invalid){
      return;
    }
    console.log("login",this.loginForm.value);
    this.auth.loginForm(this.loginForm.value)
    .subscribe({
      next:(data)=>{
     console.log("dataa >>>>>",data);
     
      },
      error:(err)=>{
      console.log("error",err);
      
      }
    })
    
  }

}
