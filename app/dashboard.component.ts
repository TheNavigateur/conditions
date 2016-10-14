import {Component, OnInit, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ConditionSearchService } from './condition-search.service';
import { Condition } from './condition';

@Component({
  moduleId: module.id,
  selector: 'my-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  providers: [ConditionSearchService]
})
export class DashboardComponent implements OnInit, AfterViewInit {

  conditions: Observable<Condition[]>;
  private searchTerms = new Subject<string>();

  synonymsToShow: Array;

  constructor(
    private conditionSearchService: ConditionSearchService,
    private router: Router) { }

  search(term: string): void {
    // Push a search term into the observable stream.
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.conditions = this.searchTerms
      .debounceTime(300)        // wait for 300ms pause in events
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => this.conditionSearchService.search(term))
      .catch(error => {
        // TODO: real error handling
        console.log(error);
        return Observable.of<Condition[]>([]);
      });
  }

  ngAfterViewInit(): void {
    this.search("");
  }

  showSynonyms(condition: Condition): void {
    this.synonymsToShow = condition.synonyms;
  }

  hideSynonyms(): void {
    this.synonymsToShow = null;
  }
}
