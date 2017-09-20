import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';

import 'rxjs/add/operator/expand';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/publishReplay';

import { PaginationNext } from '../api/model/paginationNext';

interface ListResponse<Item> {
  items: Item[];
  next?: PaginationNext;
}

export abstract class CachingBaseService<Item extends { id: any; }> {
  protected readonly pageSize: number = 100;

  private readonly cache = new Map<string, ReplaySubject<Item>>();
  private initCache$: ConnectableObservable<number>;

  protected initCache() {
    this.initCache$ = Observable.of(0)
      .expand(next =>
        isNaN(next) ? Observable.of() :
          this.listItems(next, this.pageSize)
            .map(response => this.cacheListResponse(response)))
      .filter(next => isNaN(next))
      .publishReplay(1);
    this.initCache$.connect();
  }

  protected listItems(offset?: number, limit?: number): Observable<ListResponse<Item>> {
    return Observable.of({
      items: [],
    });
  }

  protected fetchItem(id: string): Observable<Item> {
    return Observable.of({ id } as Item);
  }

  private cacheListResponse(response: ListResponse<Item>) {
    response.items.forEach(item => this.update(item));
    return Number(response.next);
  }

  update(item: Item) {
    this.getCache(String(item.id))
      .next(this.deepCopy(item));
  }

  private deepCopy(item: Item) {
    return JSON.parse(JSON.stringify(item));
  }

  private getCache(id: string, fetch = false) {
    let item$ = this.cache.get(id);
    if (item$ === undefined) {
      item$ = new ReplaySubject<Item>(1);
      this.cache.set(id, item$);
      if (fetch) {
        this.fetchItem(id).subscribe(item => item$.next(item));
      }
    }
    return item$;
  }

  get(id: string) {
    return this.initCache$
      .flatMap(() => this.getCache(id, true))
      .map(this.deepCopy);
  }

  list() {
    return this.initCache$
      .flatMap(() => {
        const items = Array.from(this.cache.values());
        return items.length > 0 ?
          Observable.combineLatest(items) :
          Observable.of([]);
      })
      .map(items => items.map(this.deepCopy));
  }
}
