import { Component } from '@angular/core';
import { MusicService } from '../../Services/music.service';


@Component({
  selector: 'mahi-player',
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  constructor(readonly music: MusicService) {}

  seek(event: Event): void {
    this.music.seekTo(Number((event.target as HTMLInputElement).value));
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  }
}
