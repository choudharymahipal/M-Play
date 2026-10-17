import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MusicService, Track } from '../../Services/music.service';

interface Collection {
  title: string;
  query: string;
  tracks: Track[];
}

@Component({
  selector: 'mahi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  readonly prompts = [
    { title: 'Fresh finds', query: 'indie pop' },
    { title: 'After hours', query: 'chill electronic' },
    { title: 'Guitar season', query: 'alternative rock' },
    { title: 'Good energy', query: 'upbeat pop' }
  ];
  collections: Collection[] = [];
  loading = true;

  constructor(private music: MusicService, private router: Router) {}

  ngOnInit(): void {
    forkJoin(this.prompts.map(prompt =>
      this.music.searchTracks(prompt.query, 12).pipe(catchError(() => of([])))
    )).subscribe(results => {
      this.collections = this.prompts.map((prompt, index) => ({
        ...prompt,
        tracks: results[index]
      }));
      this.loading = false;
    });
  }

  play(track: Track, tracks: Track[]): void {
    this.music.playTrack(track, tracks);
  }

  search(query: string): void {
    void this.router.navigate(['/search'], { queryParams: { q: query } });
  }
}
