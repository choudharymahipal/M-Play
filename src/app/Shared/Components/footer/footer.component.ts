import { Component } from '@angular/core';

@Component({
  selector: 'mahi-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  isPlaying: boolean = false;
  isValume: boolean = true;

  playPauseButton() {
    this.isPlaying = !this.isPlaying;
  }

  volumeClicked() {
    this.isValume = !this.isValume;
  }
}
