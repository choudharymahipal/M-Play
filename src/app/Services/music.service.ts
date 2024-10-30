import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private apiUrl = 'https://api.deezer.com';

  constructor(private http: HttpClient) {}

  searchSongs(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?q=${query}`);
  }

  getTrack(trackId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/track/${trackId}`);
  }
}
