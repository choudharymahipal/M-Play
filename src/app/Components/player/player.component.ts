import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

interface Song {
  title: string;
  artist: string;
  albumCover: string;
}


@Component({
  selector: 'mahi-player',
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
  animations: [
    trigger('fade', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class PlayerComponent {
  currentSongIndex: number = 0;
  isPlaying: boolean = false;

  playlist: Song[] = [
    { title: 'Song 1', artist: 'Artist 1', albumCover: 'path/to/albumCover1.jpg' },
    { title: 'Song 2', artist: 'Artist 2', albumCover: 'path/to/albumCover2.jpg' },
    { title: 'Song 3', artist: 'Artist 3', albumCover: 'path/to/albumCover3.jpg' },
    // Add more songs or fetch from an API
  ];

  get currentSong(): Song {
    return this.playlist[this.currentSongIndex];
  }

  togglePlay(): void {
    this.isPlaying = !this.isPlaying;
    // Logic to play or pause the song goes here
  }

  nextTrack(): void {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
    this.isPlaying = true;
    // Logic to play the next track goes here
  }

  previousTrack(): void {
    this.currentSongIndex =
      (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
    this.isPlaying = true;
    // Logic to play the previous track goes here
  }
}
