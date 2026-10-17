import { Component } from '@angular/core';
import { MusicService, Track } from '../../../Services/music.service';

@Component({
  selector: 'mahi-music-library',
  templateUrl: './music-library.component.html',
  styleUrl: './music-library.component.scss'
})
export class MusicLibraryComponent {
  readonly favorites$ = this.music.favorites$;

  constructor(readonly music: MusicService) {}

  play(track: Track, tracks: Track[]): void {
    this.music.playTrack(track, tracks);
  }
}
