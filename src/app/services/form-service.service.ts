import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private countriesUrl = "http://localhost:8080/api/countries";
  private statesUrl = "http://localhost:8080/api/states"

  constructor(private httpClient: HttpClient) {}

  getCreditCardMonths(month: number): Observable<number[]>{
    let data: number[] = [];
    for (;month<=12; month++) {
      data.push(month);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let startYear: number = new Date().getFullYear();
    let endYear: number = startYear + 10;
    let data: number[] = []
    for (; startYear <= endYear; startYear++){
      data.push(startYear);
    }
    return of(data);
  }

  getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(map(response => response._embedded.countries));
  }

  getStates(countryCode: string): Observable<State[]>{
    const searchUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;
    console.log(searchUrl);
    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(map(response => response._embedded.states));
  }
}


interface GetResponseCountries{
  _embedded:{
    countries: Country[]
  }
}

interface GetResponseStates{
  _embedded:{
    states: State[]
  }
}