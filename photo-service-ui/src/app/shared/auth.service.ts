// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthenticationService {
//   private apiUrl = 'http://localhost:3000/login'; 
//   private loggedIn = new BehaviorSubject<boolean>(false);


//   constructor(private http: HttpClient) { 

//     this.checkToken(); 

//   }


//   private checkToken(): void {
//     const token = localStorage.getItem('token');
//     if (token) {
//       this.loggedIn.next(true); 
//     }
//   }

//   login(username: string, password: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}`, { username, password }).pipe(
//       tap(() => {
//         this.loggedIn.next(true); 
//         localStorage.setItem('accessToken', 'your-token-here'); 
//       })
//     );
//   }
//   logout(): void {
//     this.loggedIn.next(false);
//     console.log(`${localStorage.getItem('accessToken')} removed`);
//     localStorage.removeItem('token');
//   }

//   isLoggedIn(): Observable<boolean> {
//     console.log('Checking authentication state...');
//     const loggedIn = this.loggedIn.getValue();
//     console.log('Is logged in:', loggedIn);
//     return this.loggedIn.asObservable();
//   } 
// }

// authentication.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:3000/login'; // Your backend API URL
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router) {
    this.checkToken(); // Check token when service is constructed
  }

  private checkToken(): void {
    const token = localStorage.getItem('accessToken');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.loggedIn.next(true); // Set loggedIn to true if token exists and not expired
    } else {
      this.loggedIn.next(false); // Set loggedIn to false if token is expired or not found
      localStorage.removeItem('accessToken'); // Remove expired token
    }
  }

  login(username: string, password: string): Observable<any> {
    // Make HTTP request to backend to authenticate user
    return this.http.post(`${this.apiUrl}`, { username, password }).pipe(
      tap((response: any) => {
        // Store the JWT token in localStorage
        localStorage.setItem('accessToken', response.accessToken);
        this.loggedIn.next(true); // Update loggedIn state after successful login
      })
    );
  }

  logout(): void {
    // Perform logout actions, e.g., clear local storage, etc.
    this.loggedIn.next(false);
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
}

