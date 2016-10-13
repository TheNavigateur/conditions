import {Component, OnInit, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

@Component({
  moduleId: module.id,
  selector: 'my-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  providers: [HeroSearchService]
})
export class DashboardComponent implements OnInit, AfterViewInit {

  heroes: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  synonymsToShow: Array;

  constructor(
    private heroSearchService: HeroSearchService,
    private router: Router) { }

  search(term: string): void {
    // Push a search term into the observable stream.
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes = this.searchTerms
      .debounceTime(300)        // wait for 300ms pause in events
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => this.heroSearchService.search(term))
      .catch(error => {
        // TODO: real error handling
        console.log(error);
        return Observable.of<Hero[]>([]);
      });
  }

  ngAfterViewInit(): void {
    this.search("");
  }

  showSynonyms(hero: Hero): void {
    this.synonymsToShow = hero.synonyms;
  }

  hideSynonyms(): void {
    this.synonymsToShow = null;
  }
}
