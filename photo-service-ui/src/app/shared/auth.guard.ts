import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, switchMap, take, of, tap } from 'rxjs';
import { AuthenticationService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthenticationService) {}

  canActivate(): boolean {
    const token = localStorage.getItem('accessToken');
    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}


  // canActivate(): Observable<boolean> {
  //   const token = localStorage.getItem('token');
  //   return this.authService.isLoggedIn().pipe(
  //     tap(loggedIn => {
  //       if (!loggedIn) {
  //         this.router.navigate(['/login']);
  //       }
  //     })
  //   );
  // }

//   canActivate(): Observable<boolean> {
//     return this.authService.isLoggedIn().pipe(
//       take(1), // Take only the first emission
//       switchMap(loggedIn => {
//         if (!loggedIn) {
//           console.log("Not logged in!")
//           this.router.navigate(['/login']);
//           return of(false);
//         }
//         console.log("succesful logged in!")

//         return of(true);
//       })
//     );
//   }
// }