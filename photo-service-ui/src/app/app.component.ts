// app.component.ts
import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'My Photo App';
  // isMenuOpen: boolean = false;


  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  // toggleMenu() {
  //   this.isMenuOpen = !this.isMenuOpen;
  // }
  
  // closeMenu() {
  //   this.isMenuOpen = false;
  // }
}
