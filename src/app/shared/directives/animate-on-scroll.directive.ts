import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAnimateOnScroll]',
  standalone: true
})
export class AnimateOnScrollDirective implements OnInit, OnDestroy {
  @Input() animationName: string = 'animate-fade-in-up';
  @Input() animationDelay: string = '0ms';
  
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Hide initially
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    
    // Set up observer
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (this.animationDelay) {
            this.renderer.setStyle(this.el.nativeElement, 'animation-delay', this.animationDelay);
          }
          this.renderer.addClass(this.el.nativeElement, this.animationName);
          this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
          
          // Stop observing once animated
          this.observer.unobserve(this.el.nativeElement);
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
