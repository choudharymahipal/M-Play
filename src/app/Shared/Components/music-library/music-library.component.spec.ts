import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicLibraryComponent } from './music-library.component';

describe('MusicLibraryComponent', () => {
  let component: MusicLibraryComponent;
  let fixture: ComponentFixture<MusicLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MusicLibraryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MusicLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
