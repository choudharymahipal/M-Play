import { Component } from '@angular/core';

@Component({
  selector: 'mahi-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  theme: 'light-theme' | 'dark-theme' = 'light-theme';
  IsDrawer: boolean = true;
  
  toggleTheme() {
    this.theme = this.theme === 'light-theme' ? 'dark-theme' : 'light-theme';
  }
  onLogout(){
    //
  }
}
