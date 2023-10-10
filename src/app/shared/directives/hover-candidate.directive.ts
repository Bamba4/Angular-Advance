import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[hover-candidate]',
})
export class HoverCandidateDirective implements AfterViewInit {
  @Input() color = 'white';
  constructor(private el: ElementRef, private render: Renderer2) {}

  setBackgroundColor(color: string) {
    this.render.setStyle(this.el.nativeElement, 'background-color', color);
  }

  ngAfterViewInit(): void {
    this.setBackgroundColor(this.color);
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.setBackgroundColor('yellow');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setBackgroundColor('white');
  }
}
