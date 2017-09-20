import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { fakeUUIDs } from '../../testing';

import { CachingBaseService } from './caching-base.service';

interface Item {
  id: string;
  name?: string;
}

@Injectable()
class ItemsCachingService extends CachingBaseService<Item> {
  readonly pageSize: number;

  initCache() {
    super.initCache();
  }

  listItems(offset?: number, limit?: number) {
    return super.listItems(offset, limit);
  }

  fetchItem(id: string) {
    return super.fetchItem(id);
  }
}

describe('CachingBaseService', () => {
  const fakeItemCount = 10;

  const item_ids = fakeUUIDs(fakeItemCount);

  const fakeItemName = (i: number) =>
    'Item ' + i;

  const fakeItem = (i: number) => ({
    id: item_ids[i],
    name: fakeItemName(i),
  });

  const fakeItems = (offset: number, limit: number) =>
    Array.from({length: limit}, (d, i) => fakeItem(offset + i));

  let service: ItemsCachingService;

  let spyOnListItems: jasmine.Spy;
  let spyOnFetchItem: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ItemsCachingService,
      ],
    });

    spyOnListItems = spyOn(ItemsCachingService.prototype, 'listItems')
      .and.returnValues(Observable.of({
        items: fakeItems(0, fakeItemCount / 2),
        next: fakeItemCount / 2,
      }), Observable.of({
        items: fakeItems(fakeItemCount / 2, fakeItemCount / 2),
      }));
    spyOnFetchItem = spyOn(ItemsCachingService.prototype, 'fetchItem')
      .and.callFake(id => Observable.of(fakeItem(item_ids.indexOf(id))));

    service = TestBed.get(ItemsCachingService);
  });

  it('initCache() correctly calls listItems()', () => {
    service.initCache();
    expect(spyOnListItems).toHaveBeenCalledWith(0, service.pageSize);
    expect(spyOnListItems).toHaveBeenCalledWith(fakeItemCount / 2, service.pageSize);
    expect(spyOnListItems).toHaveBeenCalledTimes(2);
  });

  it('listItems() returns correct defaults if not overridden', done => {
    spyOnListItems.and.callThrough();
    service.listItems(0, service.pageSize).subscribe(response => {
      expect(response.items.length).toEqual(0);
      expect(response.next).toBeUndefined();
      done();
    });
  });

  it('fetchItem() returns correct defaults if not overridden', done => {
    const itemIndex = fakeItemCount / 2 + 1;
    spyOnFetchItem.and.callThrough();
    service.fetchItem(item_ids[itemIndex]).subscribe(response => {
      expect(response).toEqual({
        id: item_ids[itemIndex],
      });
      done();
    });
  });

  describe('list()', () => {
    it('returns an empty list initially if listItems() is not overridden', done => {
      spyOnListItems.and.callThrough();
      service.initCache();
      service.list().subscribe(items => {
        expect(items.length).toBe(0);
        done();
      });
    });

    it('returns a deep copy of cached items', done => {
      const testItems = (items: Item[]) => {
        const itemsMap = new Map<string, Item>();
        items.forEach(item => itemsMap.set(item.id, item));

        expect(itemsMap.size).toBe(fakeItemCount);
        fakeItems(0, fakeItemCount).forEach(item => {
          expect(itemsMap.get(item.id)).toEqual(item);
        });
      };

      service.initCache();
      service.list().subscribe(items => {
        testItems(items);

        items.forEach(item => {
          item.id = 'Mutated id';
          item.name = 'Mutated name';
        });

        service.list().subscribe(sameItems => {
          testItems(sameItems);
          done();
        });
      });
    });
  });

  describe('get()', () => {
    const itemIndex = fakeItemCount / 2 + 1;

    it('calls fetchItem() once with correct parameters if item is not cached', done => {
      spyOnListItems.and.callThrough();
      service.initCache();
      service.get(item_ids[itemIndex]).subscribe(item => {
        expect(spyOnFetchItem).toHaveBeenCalledTimes(1);
        expect(spyOnFetchItem).toHaveBeenCalledWith(item_ids[itemIndex]);
        done();
      });
    });

    it('does not call fetchItem() if item is cached', done => {
      service.initCache();
      service.get(item_ids[itemIndex]).subscribe(item => {
        expect(spyOnFetchItem).not.toHaveBeenCalled();
        done();
      });
    });

    it('does not call fetchItem() again for an existing fetch request', done => {
      spyOnListItems.and.callThrough();
      service.initCache();
      service.get(item_ids[itemIndex]).subscribe();
      expect(spyOnFetchItem).toHaveBeenCalledTimes(1);

      service.get(item_ids[itemIndex]).subscribe(item => {
        expect(spyOnFetchItem).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('does not call listItems() again', done => {
      spyOnListItems.and.callThrough();
      service.initCache();
      expect(spyOnListItems).toHaveBeenCalledTimes(1);

      service.get(item_ids[itemIndex]).subscribe(item => {
        expect(spyOnListItems).toHaveBeenCalledTimes(1);
        done();
      });
    });

    describe('returns a deep copy of', () => {
      it('a cached item', () => service.initCache());
      it('a new item', () => {
        spyOnListItems.and.callThrough();
        service.initCache();
      });

      afterEach(done => {
        const testItem = (item: Item) => {
          expect(item).toEqual(fakeItem(itemIndex));
        };
        service.get(item_ids[itemIndex]).subscribe(item => {
          testItem(item);

          item.id = 'Mutated id';
          item.name = 'Mutated name';

          service.get(item_ids[itemIndex]).subscribe(sameItem => {
            testItem(sameItem);
            done();
          });
        });
      });
    });
  });

  describe('update()', () => {
    const itemIndex = fakeItemCount / 2 + 1;

    describe('caches', () => {
      it('updates cache for an existing item', () => {
        service.initCache();
      });
      it('caches a new item', () => {
        spyOnListItems.and.callThrough();
        service.initCache();
      });
      afterEach(done => {
        service.update({
          id: item_ids[itemIndex],
          name: fakeItemName(itemIndex) + ' (updated)',
        });
        service.get(item_ids[itemIndex]).subscribe(item => {
          expect(item).toEqual({
            id: item_ids[itemIndex],
            name: fakeItemName(itemIndex) + ' (updated)',
          });
          done();
        });
      });
    });

    it('caches a deep copy of the item', done => {
      spyOnListItems.and.callThrough();
      service.initCache();

      const item = fakeItem(itemIndex);
      service.update(item);

      item.id = 'Mutated id';
      item.name = 'Mutated name';

      service.get(item_ids[itemIndex]).subscribe(sameItem => {
        expect(sameItem).toEqual(fakeItem(itemIndex));
        done();
      });
    });

    it('does not call fetchItem() for a new item', () => {
      spyOnListItems.and.callThrough();
      service.initCache();

      service.update(fakeItem(itemIndex));
      expect(spyOnFetchItem).not.toHaveBeenCalled();
    });
  });
});
