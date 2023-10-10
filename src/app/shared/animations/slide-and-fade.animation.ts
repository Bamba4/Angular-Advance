import { animate, animation, style } from '@angular/animations';

export const SlideAndFade = animation([
  style({
    transform: 'translateX(-100%)',
    opacity: 0,
    backgoundColor: '{{startColor}}',
  }),
  animate(
    '{{time}} ease-out',
    style({
      transform: 'translateX(0)',
      opacity: 1,
      backgoundColor: 'white',
    })
  ),
]);
