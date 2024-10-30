import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { MusicService } from '../../Services/music.service';


interface Song {
  title: string;
  artist: string;
  albumCover: string;
}

@Component({
  selector: 'mahi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class HomeComponent {
  trendingSongs: Song[] = [
    { title: 'Song 1', artist: 'Artist 1', albumCover: 'path/to/albumCover1.jpg' },
    { title: 'Song 2', artist: 'Artist 2', albumCover: 'path/to/albumCover2.jpg' },
    { title: 'Song 3', artist: 'Artist 3', albumCover: 'path/to/albumCover3.jpg' },
    // Add more songs or fetch from an API
  ];

  ngOnInit(): void {
    // Fetch trending songs from an API if available
  }
}
