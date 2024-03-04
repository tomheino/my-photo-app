// toolbar.component.ts
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthenticationService } from '../shared/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { slideInAnimation } from '../shared/animations';
import { Router } from '@angular/router';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
animations: [
  slideInAnimation,
  trigger('menuIconAnimation', [
    state('open', style({ transform: 'rotate(45deg)' })),
    state('closed', style({ transform: 'rotate(0deg)' })),
    transition('open <=> closed', animate('200ms ease-in-out')),
  ]),
  trigger('menuBarAnimation', [
    state('open', style({ transform: 'rotate(45deg)' })),
    state('closed', style({ transform: 'rotate(0deg)' })),
    transition('open <=> closed', animate('200ms ease-in-out')),
  ]),
]


})
export class ToolbarComponent {
  @Input() theappname: string = "Default name";
  // isLoggedIn = false;
  isLoggedIn(): boolean {
    // Check if the JWT token is present in localStorage
    return !!localStorage.getItem('accessToken');
  }

  isMenuOpen: boolean = false;

  loginVisible: boolean = false;

  constructor(private snackBar: MatSnackBar, private router: Router) {}

  logout() {
    localStorage.removeItem('accessToken');
    this.showNotification('Logout successful');
    this.router.navigateByUrl('/');
  }

  toggleLogin() {
    this.loginVisible = !this.loginVisible;
  }
  @Output() menuToggle = new EventEmitter<void>();
  username: string = '';
  password: string = '';

  private showNotification(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center', // Positioning the notification
      verticalPosition: 'bottom' // Positioning the notification
    });
}
toggleMenu() {
  console.log('Toggling menu');

  this.isMenuOpen = !this.isMenuOpen;
}

closeMenu() {
  this.isMenuOpen = false;
}
}
