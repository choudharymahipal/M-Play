import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  artworkUrl: string;
  previewUrl: string;
  duration: number;
  genre: string;
}

interface ITunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  previewUrl: string;
  trackTimeMillis: number;
  primaryGenreName: string;
}

interface ITunesResponse {
  results: ITunesTrack[];
}

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private readonly apiUrl = 'https://itunes.apple.com/search';
  private readonly currentTrackSubject = new BehaviorSubject<Track | null>(null);
  private readonly playingSubject = new BehaviorSubject(false);
  private readonly progressSubject = new BehaviorSubject(0);
  private readonly durationSubject = new BehaviorSubject(0);
  private readonly volumeSubject = new BehaviorSubject(0.7);
  private readonly favoritesSubject = new BehaviorSubject<Track[]>(this.loadFavorites());
  private readonly playbackErrorSubject = new BehaviorSubject<string | null>(null);
  private readonly audio = new Audio();
  private queue: Track[] = [];
  private queueIndex = -1;

  readonly currentTrack$ = this.currentTrackSubject.asObservable();
  readonly isPlaying$ = this.playingSubject.asObservable();
  readonly progress$ = this.progressSubject.asObservable();
  readonly duration$ = this.durationSubject.asObservable();
  readonly volume$ = this.volumeSubject.asObservable();
  readonly favorites$ = this.favoritesSubject.asObservable();
  readonly playbackError$ = this.playbackErrorSubject.asObservable();

  constructor(private http: HttpClient) {
    this.audio.volume = this.volumeSubject.value;
    this.audio.addEventListener('timeupdate', () => this.progressSubject.next(this.audio.currentTime));
    this.audio.addEventListener('loadedmetadata', () => this.durationSubject.next(this.audio.duration));
    this.audio.addEventListener('play', () => this.playingSubject.next(true));
    this.audio.addEventListener('pause', () => this.playingSubject.next(false));
    this.audio.addEventListener('ended', () => this.nextTrack());
    this.audio.addEventListener('error', () => {
      this.playingSubject.next(false);
      this.playbackErrorSubject.next(this.getPlaybackErrorMessage());
    });
  }

  searchTracks(query: string, limit = 20): Observable<Track[]> {
    return this.http.get<ITunesResponse>(this.apiUrl, {
      params: { term: query, entity: 'song', limit, country: 'US' }
    }).pipe(
      map(response => response.results
        .filter(track => Boolean(track.previewUrl))
        .map(track => this.toTrack(track)))
    );
  }

  get currentTrack(): Track | null {
    return this.currentTrackSubject.value;
  }

  get isPlaying(): boolean {
    return this.playingSubject.value;
  }

  get progress(): number {
    return this.progressSubject.value;
  }

  get duration(): number {
    return this.durationSubject.value;
  }

  playTrack(track: Track, queue: Track[] = [track]): void {
    this.queue = queue.length ? [...queue] : [track];
    this.queueIndex = this.queue.findIndex(item => item.id === track.id);
    if (this.queueIndex < 0) {
      this.queue.unshift(track);
      this.queueIndex = 0;
    }

    this.currentTrackSubject.next(track);
    this.progressSubject.next(0);
    this.durationSubject.next(track.duration);
    this.playbackErrorSubject.next(null);
    this.audio.src = track.previewUrl;
    this.startAudio();
  }

  togglePlayback(): void {
    if (!this.currentTrack) return;
    if (this.audio.paused) this.startAudio();
    else this.audio.pause();
  }

  nextTrack(): void {
    if (!this.queue.length) return;
    this.queueIndex = (this.queueIndex + 1) % this.queue.length;
    this.playTrack(this.queue[this.queueIndex], this.queue);
  }

  previousTrack(): void {
    if (!this.queue.length) return;
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      this.progressSubject.next(0);
      return;
    }
    this.queueIndex = (this.queueIndex - 1 + this.queue.length) % this.queue.length;
    this.playTrack(this.queue[this.queueIndex], this.queue);
  }

  seekTo(seconds: number): void {
    this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration || 0));
    this.progressSubject.next(this.audio.currentTime);
  }

  setVolume(volume: number): void {
    const normalizedVolume = Math.max(0, Math.min(volume, 1));
    this.audio.volume = normalizedVolume;
    this.volumeSubject.next(normalizedVolume);
  }

  toggleFavorite(track: Track): void {
    const favorites = this.favoritesSubject.value;
    const updated = favorites.some(item => item.id === track.id)
      ? favorites.filter(item => item.id !== track.id)
      : [track, ...favorites];
    this.favoritesSubject.next(updated);
    localStorage.setItem('m-play-favorites', JSON.stringify(updated));
  }

  isFavorite(track: Track): boolean {
    return this.favoritesSubject.value.some(item => item.id === track.id);
  }

  private startAudio(): void {
    void this.audio.play().then(
      () => this.playingSubject.next(true),
      error => {
        this.playingSubject.next(false);
        this.playbackErrorSubject.next(error?.name === 'NotAllowedError'
          ? 'Playback was blocked by the browser. Press play to try again.'
          : this.getPlaybackErrorMessage());
      }
    );
  }

  private getPlaybackErrorMessage(): string {
    switch (this.audio.error?.code) {
      case 1: return 'Preview playback was interrupted. Press play to try again.';
      case 2: return 'The preview could not load. Check your connection and try again.';
      case 3: return 'This browser could not decode the audio preview.';
      case 4: return 'This browser does not support this audio preview format.';
      default: return 'This audio preview could not be played. Try another track.';
    }
  }

  private toTrack(track: ITunesTrack): Track {
    return {
      id: track.trackId,
      title: track.trackName,
      artist: track.artistName,
      album: track.collectionName,
      artworkUrl: track.artworkUrl100?.replace(/\/\d+x\d+bb\./, '/600x600bb.') ?? '',
      previewUrl: track.previewUrl,
      duration: Math.min(30, Math.floor(track.trackTimeMillis / 1000)),
      genre: track.primaryGenreName
    };
  }

  private loadFavorites(): Track[] {
    try {
      return JSON.parse(localStorage.getItem('m-play-favorites') ?? '[]') as Track[];
    } catch {
      return [];
    }
  }
}
