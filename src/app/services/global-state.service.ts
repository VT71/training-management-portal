import { Injectable, OnInit, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
//   private authService = inject(AuthService);

//   private userRole = new BehaviorSubject<string>('');
//   roleSource = this.userRole.asObservable();

//   constructor() {}

//   loadRole() {
//     console.log('IS ADMIN INIT');
//     this.authService.isAdmin().pipe(
//       map((isAdmin) => {
//         console.log('IS ADMIN: ' + isAdmin);
//         this.userRole.next(isAdmin === true ? 'admin' : 'employee');
//       })
//     );
//   }

//   changeUserRole(role: string) {
//     this.userRole.next(role);
//   }
}
