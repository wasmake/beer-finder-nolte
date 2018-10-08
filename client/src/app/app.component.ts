import { Component, OnInit, ElementRef } from '@angular/core';

import { CarService } from './services/car.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../vendor/css/bootstrap.min.css', '../vendor/css/app.css'],
  providers: [CarService]
})
export class AppComponent implements OnInit{
  year = '';
  maker = '';
  model = '';
  from = '';
  to = '';
  fuelavg = '';
  address: String[];
  result: String[];
  yearDisabled: boolean = false;
  makerDisabled: boolean = false;
  modelDisabled: boolean = false;
  fromInput: boolean = true;
  constructor(private carService : CarService, private elementRef : ElementRef ){
  }
  ngOnInit(){
    this.yearDisabled = true;
    this.makerDisabled = true;
    this.modelDisabled = true;
    this.getYears();
    this.yearDisabled = false;
    this.trackMe();
  }
  changeLocation(){
    this.fromInput = !this.fromInput;
  }
  getYears(){
    this.carService.getYears().subscribe(res => {
      this.carService.carYears = res as String[];
    });
  }

  loadMakers(_year: string){
    this.year = _year;
    this.carService.getCarMakers(_year).subscribe(res => {
      this.carService.carMakers = res as String[];
      this.makerDisabled = false;
    })
    this.yearDisabled = true;
  }

  loadModels(_maker: string){
    this.maker = _maker;
    this.carService.getCarModels(_maker).subscribe(res => {
      this.carService.carModels = res as String[];
      this.modelDisabled = false;
    })
    this.makerDisabled = true;
  }

  loadAvg(_model: string){
    this.model = _model;
    this.carService.getAvg(_model).subscribe(res => {
      this.carService.carAvg = res as String[];
    })
    this.modelDisabled = true;
  }

  trackMe() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        this.showPosition(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  showPosition(position) {
    this.carService.getLocation(position.coords.latitude+","+position.coords.longitude).subscribe(res => {
      this.from = res.address ? res.address : '';
    })
  }

  loadTo(_to: string){
    setTimeout(()=>{
      let domElement = this.elementRef.nativeElement.querySelector(`#to`).value;
      this.carService.getProcess(this.from.split(' ').join('+') +"&dest="+domElement.split(' ').join('+')).subscribe(res =>{
        this.result = res as String[];
        console.log(this.carService.carAvg);
        console.log(this.result.rows[0].elements[0].distance.text);
        this.fuelavg = parseFloat(Math.round(this.result.rows[0].elements[0].distance.text.replace(/\D/g, "")/this.carService.carAvg.kml * 100) / 100).toFixed(2);
      })
    }, 100);
    //fuelavg = this.result.rows[0].elements[0].distance.text;
  }

  title = 'Fuel';
}
