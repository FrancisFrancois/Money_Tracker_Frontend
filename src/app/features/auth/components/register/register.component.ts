import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

// Décore le composant avec des métadonnées, y compris le sélecteur, le chemin du template HTML et le chemin du fichier de style.
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  // Déclare un FormGroup pour gérer le formulaire d'inscription.
  registerForm: FormGroup;

  // Le constructeur injecte les services nécessaires.
  constructor(
    private _fb: FormBuilder, // FormBuilder pour créer le formulaire réactif.
    private _authService: AuthService, // AuthService pour la logique d'authentification.
    private _router: Router // Router pour la navigation entre les composants.
  ) {
    // Initialise le formulaire avec des champs pour les informations de l'utilisateur, chacun avec des règles de validation spécifiques.
    this.registerForm = this._fb.group({
      lastname: [null, [Validators.required]], // Champ 'nom' obligatoire.
      firstname: [null, [Validators.required]], // Champ 'prénom' obligatoire.
      pseudo: [null, [Validators.required]], // Champ 'pseudo' obligatoire.
      email: [null, [Validators.required, Validators.email]], // Champ 'email' avec validation d'email.
      password: [null, [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]], // Mot de passe avec exigences spécifiques.
      confirmpassword: [null, [Validators.required]], // Confirmation du mot de passe obligatoire.
    }, {
      validators: this.passwordMatchValidator // Utilise un validateur personnalisé pour comparer les mots de passe.
    });
  }

  // Valide si les champs 'password' et 'confirmpassword' ont des valeurs identiques.
  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmpassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null; // Si les champs 'password' ou 'confirmpassword' n'existent pas, on renvoie null.
    }

    // Compare les valeurs des deux champs.
    return passwordControl.value === confirmPasswordControl.value ? null : { 'passwordMismatch': true };
  }

  // Méthode pour gérer l'inscription de l'utilisateur.
  registerUser() {
    if (this.registerForm.valid) {
      // Si le formulaire est valide, envoie les données d'inscription au service AuthService.
      this._authService.register(this.registerForm.value).subscribe({
        complete: () => {
          // Redirige vers la page de connexion en cas de succès.
          this._router.navigateByUrl('/login'); 
        }
      });
    } else {
      // Si le formulaire n'est pas valide, marque tous les champs comme touchés pour afficher les erreurs.
      this.registerForm.markAllAsTouched();
      console.log("FORMULAIRE INVALIDE");
    }
  }
}

