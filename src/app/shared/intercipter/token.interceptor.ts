import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private router : Router) {} 
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getAuthToken();
        if (token) {
            // If we have a token, we set it to the header
            request = request.clone({
               setHeaders: {Authorization: `bearer ${token}`}
            });
         }

         return next.handle(request).pipe(
            catchError((err) => {
                console.log(err)
              if (err instanceof HttpErrorResponse) {
                  if (err.status === 401) {
                   this.router.navigate(['/login'])
                  // redirect user to the logout page
               }
            }
            return throwError(err);
          })
         )
   }
}