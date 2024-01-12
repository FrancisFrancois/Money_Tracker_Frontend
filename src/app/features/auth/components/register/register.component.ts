import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) {
    // Initialisation du formulaire réactif avec des champs et des validateurs.
    this.registerForm = this._fb.group({
      lastname: [null, [Validators.required]],
      firstname: [null, [Validators.required]],
      pseudo: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]],
      confirmpassword: [null, [Validators.required]],
    }, {
      // Utilisation d'un validateur personnalisé pour vérifier si les mots de passe correspondent.
      validators: this.passwordMatchValidator
    });
  }

  // Fonction de validation personnalisée pour comparer les mots de passe.
  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmpassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null; // Si l'un des contrôles est absent, retournez null (pas d'erreur).
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    // Vérifie si les mots de passe correspondent, sinon retourne une erreur.
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }


  registerUser() {
    if (this.registerForm.valid) {

      this._authService.register(this.registerForm.value).subscribe({
        complete: () => {
          this._router.navigateByUrl('/login'); 
        }
      });
      console.log(this.registerForm.value); 
      console.log("FORMULAIRE VALIDE");
    } else {
  
      this.registerForm.markAllAsTouched();
      console.log("FORMULAIRE INVALIDE");
    }
  }
}