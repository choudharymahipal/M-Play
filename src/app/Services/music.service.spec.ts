import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { MusicService, Track } from './music.service';

describe('MusicService', () => {
  let service: MusicService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.removeItem('m-play-favorites');
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(MusicService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.removeItem('m-play-favorites');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('maps iTunes tracks and excludes tracks without playable previews', () => {
    let tracks: Track[] = [];
    service.searchTracks('Daft Punk').subscribe(result => tracks = result);

    const request = http.expectOne(req =>
      req.url === 'https://itunes.apple.com/search' && req.params.get('term') === 'Daft Punk'
    );
    request.flush({
      results: [
        {
          trackId: 7,
          trackName: 'One More Time',
          artistName: 'Daft Punk',
          collectionName: 'Discovery',
          artworkUrl100: 'https://example.com/100x100bb.jpg',
          previewUrl: 'https://example.com/preview.m4a',
          trackTimeMillis: 320000,
          primaryGenreName: 'Dance'
        },
        { trackId: 8, trackName: 'Unavailable', previewUrl: '' }
      ]
    });

    expect(tracks.length).toBe(1);
    expect(tracks[0]).toEqual(jasmine.objectContaining({
      id: 7,
      title: 'One More Time',
      artist: 'Daft Punk',
      artworkUrl: 'https://example.com/600x600bb.jpg',
      duration: 30
    }));
  });

  it('persists liked tracks in local storage', () => {
    const track: Track = {
      id: 7,
      title: 'One More Time',
      artist: 'Daft Punk',
      album: 'Discovery',
      artworkUrl: '',
      previewUrl: '',
      duration: 30,
      genre: 'Dance'
    };

    service.toggleFavorite(track);

    expect(service.isFavorite(track)).toBeTrue();
    expect(JSON.parse(localStorage.getItem('m-play-favorites') ?? '[]')).toEqual([track]);
  });
});
