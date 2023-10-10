import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[highlight]',
})
export class HighlightDirective implements AfterViewInit {
  @Input() color = 'yellow';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  setBackgroundColor(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }

  ngAfterViewInit(): void {
    this.setBackgroundColor(this.color);
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.setBackgroundColor('red');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setBackgroundColor(this.color);
  }

  @HostListener('click') onClick() {
    this.color = 'yellow';
  }
}
