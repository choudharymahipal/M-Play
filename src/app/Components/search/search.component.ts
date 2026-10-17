import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { MusicService, Track } from '../../Services/music.service';

@Component({
  selector: 'mahi-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit, OnDestroy {
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly suggestions = ['indie pop', 'lofi', 'jazz', 'alternative rock', 'electronic'];
  searchResults: Track[] = [];
  loading = false;
  hasError = false;
  private searchSubscription?: Subscription;
  private routeSubscription?: Subscription;

  constructor(readonly music: MusicService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchControl.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      tap(query => {
        this.loading = Boolean(query.trim());
        this.hasError = false;
      }),
      switchMap(query => query.trim()
        ? this.music.searchTracks(query.trim()).pipe(catchError(() => {
          this.hasError = true;
          return of([]);
        }))
        : of([]))
    ).subscribe(results => {
      this.searchResults = results;
      this.loading = false;
    });

    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const query = typeof params['q'] === 'string' ? params['q'] : '';
      if (query !== this.searchControl.value) this.searchControl.setValue(query);
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }

  onClearSearch(): void {
    this.searchControl.setValue('');
    this.searchResults = [];
    this.hasError = false;
  }

  searchFor(query: string): void {
    this.searchControl.setValue(query);
  }

  play(track: Track): void {
    this.music.playTrack(track, this.searchResults);
  }
}
