import {
  trigger,
  transition,
  style,
  query,
  group,
  animateChild,
  animate,
  keyframes,
  state,
} from '@angular/animations';

export const fade = trigger('routeAnimations', [
  transition(
    '* <=> *',
    [style({ opacity: 0 }), animate('{{timing}} ease-in', style('*'))],
    { params: { timing: '0.6s' } }
  ),
]);

export const openClose = trigger('openClose', [
  state('true', style({ height: '*', opacity: 1 })),
  state('false', style({ height: '0px', opacity: 0 })),
  transition('false <=> true', animate(300)),
]);

export const pulse = trigger('pulse', [
  transition(
    '* <=> *',
    [style({ opacity: 0 }), animate('{{timing}} ease-in', style('*'))],
    { params: { timing: '0.4s' } }
  ),
]);
