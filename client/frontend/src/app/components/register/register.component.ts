import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  submitted:boolean=false;
  constructor(private fb:FormBuilder,private auth:AuthService) { }


  ngOnInit(): void {
    this.registerForm=this.fb.group({
      username:[''],
      email:[''],
      password:[''],
      mobile:['']
    })
  }

  get f(){
    return this.registerForm.controls;
  }

  onSubmit(){
    this.submitted=true
    if(this.registerForm.invalid){
      return
    }
   
    console.log("forms",this.registerForm.value);
    this.auth.registerForm(this.registerForm.value)
    .subscribe({
      next:(data:any)=>{
      console.log("data",data);
      
      },
      error:(err)=>{
      console.log("err",err);
      
      }
    })
    

  }

}
