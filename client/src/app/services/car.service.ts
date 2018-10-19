import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// This service is to connect our front-end (Angular) with our BackEnd
// Make functions easier to handle for all our app
@Injectable({
  providedIn: 'root'
})
export class CarService {
  carYears: String[];
  carMakers: String[];
  carModels: String[];
  carAvg: String[];
  year = "";
  make = "";
  model = "";
  // Variable to make speed coding (Easier than putting the same url a lot of times)
  readonly URL_API = 'http://localhost:3000/search/';
  constructor(private http: HttpClient) { }

  // Get years from the internal API
  getYears() {
    return this.http.get(this.URL_API + 'years');
  }
  // Get car makers from that year from the internal API
  getCarMakers(_year: string) {
    this.year = _year;
    return this.http.get(this.URL_API + `make-year/${_year}`);
  }
  // Get car models from the maker of that year from the internal API
  getCarModels(_make: string) {
    this.make = _make;
    return this.http.get(this.URL_API + `model-make-year/`+this.year+`/${_make}`);
  }
  // Get fuel economy Average from the specific car from the internal API
  getAvg(_model: string){
    this.model = _model;
    return this.http.get(this.URL_API + `car-eco/`+this.year+`/`+this.model+`/`+this.make+`/0`);
  }
  // Gets the formatted address from lat,lng position
  getLocation(_pos: string){
    return this.http.get(this.URL_API + `geolocation/${_pos}`);
  }
  // Process the origin with the destination
  getProcess(_req: string){
    return this.http.get(this.URL_API + `geodest/${_req}`);
  }
  // Returns geoapi key
  getGeoapi(){
    return this.http.get(this.URL_API + `geoapi`);
  }

}
