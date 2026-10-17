import { Component } from '@angular/core';

@Component({
  selector: 'mahi-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  theme: 'light' | 'dark' = localStorage.getItem('m-play-theme') === 'light' ? 'light' : 'dark';

  constructor() {
    this.applyTheme();
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('m-play-theme', this.theme);
    this.applyTheme();
  }

  private applyTheme(): void {
    document.body.classList.toggle('light-theme', this.theme === 'light');
  }
}
