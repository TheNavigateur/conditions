import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Hero } from './hero';

@Injectable()
export class HeroSearchService {
  constructor(private http: Http) { }

  search(term: string): Observable<Hero[]> {
    console.log("SEARCHING FOR TERM " + term);
    return this.http
      .get('api/v1/conditions/search?searchTerm=' + term)
      .map(
        (r: Response) => {
          console.log('RESPONSE IS ' + r.json());
          return r.json() as Hero[];
        }
      )
    ;
  }
}
