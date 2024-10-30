import { Component } from '@angular/core';

interface Song {
  title: string;
  artist: string;
  albumCover: string;
}

@Component({
  selector: 'mahi-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchResults: Song[] = [];
  allSongs: Song[] = [
    { title: 'Song 1', artist: 'Artist 1', albumCover: 'path/to/albumCover1.jpg' },
    { title: 'Song 2', artist: 'Artist 2', albumCover: 'path/to/albumCover2.jpg' },
    { title: 'Song 3', artist: 'Artist 3', albumCover: 'path/to/albumCover3.jpg' },
    // Add more songs or fetch from an API
  ];

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchResults = this.allSongs.filter(song => 
      song.title.toLowerCase().includes(query) || 
      song.artist.toLowerCase().includes(query)
    );
  }

  onClearSearch(): void {
    this.searchResults = [];
  }
}
