import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    series: [
      {
      data: [],
      type: 'column'
    },
    // {
    //   data: [],
    //   type: 'column'
    // },
    // {
    //   data: [],
    //   type: 'column'
    // },
   ]
  };
  highDataAge:any=[];
  highDataStandard:any=[];
  dropDownDataAge:any=[];
  countAge:any=[]
  countAgeFilter:any=[];
  ddropDownDataStandard:any=[];
  images: any;
  multipleImages: any=[];

  constructor(private auth:AuthService) {}

  ngOnInit(): void {
    this.auth.getAllData()
    .subscribe({
      next:(result)=>{
        console.log("data",result['data']);
       for(let iternary of result['data']){
        console.log("iternary",iternary['age']);
        this.highDataAge.push(Number(iternary.age));
        // this.highDataStandard.push(Number(iternary.standard));
        this.countAge.push(Number(iternary.count_isActive))
       }
       console.log("this.highDataAge",this.highDataAge);
      //  console.log("this.highDataStandard",this.highDataStandard);

       this.chartOptions = {
        xAxis: {
          categories: [...this.highDataAge]
        },
        series: [
          {
            type: 'column',
            name:'count',
            // data: this.highDataAge,
            data:this.countAge
          },
          // {
          //   type: 'column',
          //   name:'standard',
          //   data: this.highDataStandard,
          // },
   
        ],
      //   xAxis: {
      //     categories: ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester United']
      // },
      };        
      },
      error:(err)=>{
        console.log("err",err);
        
      }
    })
    
  }

  onFieldValueChange(event:any){
    console.log("event",event.target.value);
    this.auth.getDataById(event.target.value)
    .subscribe({
      next:(result:any)=>{
        console.log("data in dropdownchange",result['data']);
        let iternaryData=result['data'];
        for(let web of iternaryData){
          console.log("web",web);
          this.dropDownDataAge.push(Number(web.age));
          this.ddropDownDataStandard.push(Number(web.standard));
          this.countAgeFilter.push(Number(web.count_isActive));
        }
        console.log("this.dropDownDataAge",this.dropDownDataAge);
        // console.log("this.ddropDownDataStandard",this.ddropDownDataStandard);
        
        this.chartOptions = {
          xAxis: {
            categories: [...this.dropDownDataAge]
          },
          series: [
            {
              type: 'column',
              name:'age',
              // data: [28,30,32],
              data:this.countAgeFilter
            },
            // {
            //   type: 'column',
            //   name:'standard',
            //   // data: obj1
            //   data: this.ddropDownDataStandard,

            // },
          ],
        }; 
        
      },
      error:(err)=>{
        console.log("err",err);
        
      }
    })
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
