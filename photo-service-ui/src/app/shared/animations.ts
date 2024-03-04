import { trigger, transition, style, animate } from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-50px)' }),
    animate('1s ease', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('1s ease', style({ opacity: 0, transform: 'translateY(-100%)' }))
  ])
]);

export const slideOutAnimation = trigger('routeAnimations', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-50px)' }),
    animate('1s ease', style({ opacity: 1, transform: 'translateY(-100%)' }))
  ]),
  transition(':leave', [
    animate('1s ease', style({ opacity: 0, transform: 'translateY(0)' }))
  ])
]);

