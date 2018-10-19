import { Component, OnInit, ElementRef } from '@angular/core';

import { CarService } from './services/car.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../vendor/css/bootstrap.min.css', '../vendor/css/app.css', '../vendor/css/animate.css', '../vendor/css/fontawesome.min.css', '../vendor/css/all.min.css'],
  providers: [CarService]
})
export class AppComponent implements OnInit{
  year = '';
  maker = '';
  model = '';
  from = '';
  to = '';
  fuelavg = 0;
  address: String[];
  result: String[];
  yearDisabled: boolean = false;
  makerDisabled: boolean = false;
  modelDisabled: boolean = false;
  fuelcalc: boolean = false;
  fromInput: boolean = true;
  geoapi = '';
  constructor(private carService : CarService, private elementRef : ElementRef ){
  }
  // Load some functions at the web initial run to
  // fill the data of years and the current location
  ngOnInit(){
    this.yearDisabled = true;
    this.makerDisabled = true;
    this.modelDisabled = true;
    this.getYears();
    this.yearDisabled = false;
    this.fuelcalc = false;
    this.trackMe();
  }
  // Gets the key of google maps API
  getGeoapi(){
    this.carService.getGeoapi().subscribe(res => {
      this.geoapi = res;
    });
  }
  // Gives function to the check box
  // of current location
  changeLocation(){
    this.fromInput = !this.fromInput;
  }
  // Retrives the years from internal API
  // stores them as an Array of Strings
  getYears(){
    this.carService.getYears().subscribe(res => {
      this.carService.carYears = res as String[];
    });
  }
  // Retrives the car makers from that year from internal API
  // stores them as an Array of Strings
  loadMakers(_year: string){
    this.year = _year;
    this.carService.getCarMakers(_year).subscribe(res => {
      this.carService.carMakers = res as String[];
      this.makerDisabled = false;
    })
    this.yearDisabled = true;
  }
  // Retrives the models of the car makers from a year from internal API
  // stores them as an Array of Strings
  loadModels(_maker: string){
    this.maker = _maker;
    this.carService.getCarModels(_maker).subscribe(res => {
      this.carService.carModels = res as String[];
      this.modelDisabled = false;
    })
    this.makerDisabled = true;
  }
  // Retrives the fuel economy Avg from the specific car
  // stores them as an Array of Strings
  loadAvg(_model: string){
    this.model = _model;
    this.carService.getAvg(_model).subscribe(res => {
      this.carService.carAvg = res as String[];
    })
    this.modelDisabled = true;
  }
  // Reads the current location
  trackMe() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        this.showPosition(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  // Gives our local variable the info of the formatted location
  showPosition(position) {
    this.carService.getLocation(position.coords.latitude+","+position.coords.longitude).subscribe(res => {
      if(res != null){
        this.from = res.address ? res.address : '';
      }
    })
  }
  // Finishes the function of the web app
  // starts making the calculations
  loadTo(_to: string){
    setTimeout(()=>{
      let domElement = this.elementRef.nativeElement.querySelector(`#to`).value;
      this.carService.getProcess(this.from.split(' ').join('+') +"&dest="+domElement.split(' ').join('+')).subscribe(res =>{
        if(res != null){
          this.result = res as String[];
          console.log(this.carService.carAvg);
          console.log(this.result.rows[0].elements[0].distance.text);
          if(this.carService.carAvg.error != null){
            this.fuelavg = "Cant retrive average";
          } else {
            this.fuelavg = parseFloat(Math.round(this.result.rows[0].elements[0].distance.text.replace(/\D/g, "")/this.carService.carAvg.kml * 100) / 100).toFixed(2);
            this.fuelcalc = true;
          }
        }

      })
    }, 100);
    //fuelavg = this.result.rows[0].elements[0].distance.text;
  }

  title = 'Fuel';
}
