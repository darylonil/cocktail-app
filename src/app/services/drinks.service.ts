import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DrinksService {
  getDrinks = (searchKey: string) => {
    return this.http.get(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchKey}`
    );
  };
  constructor(private http: HttpClient) {}
}
