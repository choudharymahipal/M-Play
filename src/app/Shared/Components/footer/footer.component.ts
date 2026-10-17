import { Component } from '@angular/core';
import { MusicService } from '../../../Services/music.service';

@Component({
  selector: 'mahi-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  constructor(readonly music: MusicService) {}

  seek(event: Event): void {
    this.music.seekTo(Number((event.target as HTMLInputElement).value));
  }

  setVolume(event: Event): void {
    this.music.setVolume(Number((event.target as HTMLInputElement).value));
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  }
}
