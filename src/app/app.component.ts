import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { DrinksService } from './services/drinks.service';
import { IDrink } from './interfaces/drink';

@Component({
  selector: 'cocktail-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DrinksService],
})
export class AppComponent {
  drinks: IDrink[] = [];
  modalDetails: IDrink = {};
  ingredients: string[] = [];

  defaultLanguage: string = 'english'; // TODO: global default language selection
  langSelected: string = this.defaultLanguage;
  languageDictionary: { [key: string]: any } = {
    english: 'EN',
    spanish: 'ES',
    german: 'DE',
    italian: 'IT',
    'chinese simplified': 'ZH-HANS',
    'chinese traditional': 'ZH-HANT',
  };
  languages = [this.defaultLanguage];
  instructions?: string = '';

  dateModified?: string = '';

  constructor(
    private http: HttpClient,
    public datepipe: DatePipe,
    private drinkService: DrinksService
  ) {
    this.getDrinks('');
  }

  getDrinks = (searckKey: string) => {
    this.drinkService
      .getDrinks(searckKey)
      .subscribe((data: { [key: string]: any }) => {
        this.drinks = data['drinks'];
      });
  };

  onSearchInput = (searchKey: string) => {
    this.getDrinks(searchKey);
  };
  onDrinkSelect = (drink: IDrink) => {
    this.modalDetails = drink;
    this.ingredients = [];
    this.ingredientParser(drink);

    this.languageParser(drink);
    this.instructions = drink.strInstructions;
    this.langSelected = this.defaultLanguage;

    this.dateModified =
      this.datepipe.transform(drink.dateModified, 'mediumDate') || '';
  };

  ingredientParser = (modalDetails: IDrink) => {
    for (let i = 1; i <= 15; i++) {
      let ingredient: string = '' as string;
      let measurement: string = modalDetails[
        `strMeasure${i}` as keyof IDrink
      ] as string;
      let actIngre: string = modalDetails[
        `strIngredient${i}` as keyof IDrink
      ] as string;

      ingredient =
        measurement && actIngre
          ? `${measurement} of ${actIngre}`
          : actIngre
          ? actIngre
          : '';
      if (ingredient || ingredient !== '') this.ingredients.push(ingredient);
    }
  };

  languageParser = (modalDetails: IDrink) => {
    this.languages = [];
    Object.keys(this.languageDictionary).forEach((language) => {
      if (modalDetails[this.langaugeKeyGenerator(language) as keyof IDrink])
        this.languages.push(language);
    });
  };

  languageSelected = () => {
    const langKey: string = this.langaugeKeyGenerator(this.langSelected);
    this.instructions = this.modalDetails[langKey as keyof IDrink];
  };

  langaugeKeyGenerator = (language: string) => {
    return language === 'english'
      ? `strInstructions`
      : `strInstructions${this.languageDictionary[language]}`;
  };
}
