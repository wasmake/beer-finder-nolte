import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  readonly URL_API = 'http://localhost:3000/search/';
  constructor(private http: HttpClient) { }

  getYears() {
    return this.http.get(this.URL_API + 'years');
  }

  getCarMakers(_year: string) {
    this.year = _year;
    return this.http.get(this.URL_API + `make-year/${_year}`);
  }

  getCarModels(_make: string) {
    this.make = _make;
    return this.http.get(this.URL_API + `model-make-year/`+this.year+`/${_make}`);
  }

  getAvg(_model: string){
    this.model = _model;
    return this.http.get(this.URL_API + `car-eco/`+this.year+`/`+this.model+`/`+this.make+`/1`);
  }

  getLocation(_pos: string){
    return this.http.get(this.URL_API + `geolocation/${_pos}`);
  }

  getProcess(_req: string){
    return this.http.get(this.URL_API + `geodest/${_req}`);
  }

}
