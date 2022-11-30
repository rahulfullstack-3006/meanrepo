import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  images: any;
  multipleImages: any=[];

  constructor(private auth:AuthService) { }

  ngOnInit(): void {
  }

  selectImage(event:any){
    if(event.target.files.length>0){
      const file=event.target.files[0];
      this.images=file;
    }
  }

  onSubmit(){
    const formData=new FormData();
    formData.append('file',this.images);
    this.auth.uploadFile(formData).subscribe({
      next:(data)=>{
      console.log("file upload data",data);
      
      },
      error:(err)=>{
        console.log(err);
        
      }
    })

  }

  selectMultipleImage(event:any){
    if(event.target.files.length > 0){
      this.multipleImages=event.target.files
    }

  }

  onMultipleSubmit(){
  const formData=new FormData()
  for(let img of this.multipleImages){
    formData.append('multipleFiles',img);
  }
  this.auth.uploadMultipleFile(formData).subscribe({
    next:(data)=>{
      console.log("data for multiple",data);
    },
    error:(err)=>{
      console.log("error",err);
      
    }
  })
  }

}
