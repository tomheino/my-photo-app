// login.component.ts
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { AuthenticationService } from '../shared/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, NavigationExtras } from '@angular/router';
import { slideInAnimation } from '../shared/animations';
import { slideOutAnimation } from '../shared/animations';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

  animations: [slideInAnimation, slideOutAnimation]

    
})
export class LoginComponent {
  username = '';
  password = '';
  loginError = false;


  constructor(private router: Router, private http: HttpClient, private snackBar: MatSnackBar) {}

  login() {
    const credentials = {
      username: this.username,
      password: this.password
    };
    console.log(credentials);

    this.http.post<any>('http://localhost:3000/login', credentials)
      .subscribe(
        response => {
          // Store the JWT token in localStorage
          console.log(response);
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('username', this.username);

          this.showNotification('Login successful');
          this.router.navigate(['/mypage']); // Navigate to photos component upon successful login

          // Optionally, you can navigate to another page upon successful login
        },
        error => {
          console.error('Login failed:', error);
          this.showNotification('Login failed');

          // Handle login error (e.g., display error message to user)
        }
      );
  }
  private showNotification(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center', // Positioning the notification
      verticalPosition: 'bottom' // Positioning the notification
    });
  }
  goBack() {
    const previousRoute = sessionStorage.getItem('previousRoute');
    if (previousRoute) {
      this.router.navigateByUrl(previousRoute);
    } else {
      // Default route if no previous route is found
      this.router.navigateByUrl('/');
    }
  }
}


