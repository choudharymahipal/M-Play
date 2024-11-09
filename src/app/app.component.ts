import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy{
  vantaEffect: any;

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit() {
    this.vantaEffect = (window as any).VANTA.BIRDS({
      el: this.elRef.nativeElement.querySelector('.vanta-bg'),
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00
    });
  }

  ngOnDestroy() {
    if (this.vantaEffect) this.vantaEffect.destroy();  // Cleanup
  }
}
