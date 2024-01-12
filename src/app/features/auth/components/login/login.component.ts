import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm : FormGroup;

  errorMessage : string | undefined;

  userSubscription : Subscription = new Subscription();

  constructor(
    private _fb : FormBuilder,
    private _authService : AuthService,
    private _router: Router
  ) { 
    this.loginForm = this._fb.group({
      pseudoOrEmail : [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
      password : [null, [Validators.required, Validators.maxLength(150), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]],
    })
  }

  ngOnInit (): void {
    this.userSubscription = this._authService.$errorConnection.subscribe({
      next: (errormessage) => {
          this.errorMessage = errormessage;
      }
    })
  }

  ngOnDestroy (): void {
    this.userSubscription.unsubscribe();
  }
  
  login(): void {
    if (this.loginForm.valid) {
      this._authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response != undefined) {
            this.errorMessage = undefined;
            this._router.navigateByUrl('/dashboard-monitor');
          }
        },
        error: (error) => {
          console.error("Une erreur s'est produite lors de la connexion :", error);
        },
        complete: () => {
          console.log("Connexion terminée.");
        }
      });
    }
  }

  logout(): void {
    localStorage.removeItem('money-tracker-token');
    this._authService.logout();
  }
}



