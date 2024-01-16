import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Définit un décorateur de composant avec les métadonnées pour le composant de connexion.
@Component({
  selector: 'app-login', // Sélecteur CSS pour l'usage de ce composant.
  templateUrl: './login.component.html', // Fichier HTML associé au composant.
  styleUrls: ['./login.component.scss'] // Fichiers de style SCSS pour le composant.
})
export class LoginComponent {

  // Déclare une variable pour le formulaire de connexion.
  loginForm : FormGroup;

  // Variable pour stocker les messages d'erreur.
  errorMessage : string | undefined;

  // Souscription pour gérer l'observable lié à l'authentification.
  userSubscription : Subscription = new Subscription();

  // Constructeur pour injecter les dépendances nécessaires.
  constructor(
    private _fb : FormBuilder, // Injecte FormBuilder pour la construction de formulaires.
    private _authService : AuthService, // Injecte le service d'authentification.
    private _router: Router // Injecte le service Router pour la navigation.
  ) { 
    // Initialise le formulaire de connexion avec des champs et des validateurs.
    this.loginForm = this._fb.group({
      pseudoOrEmail : [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
      password : [null, [Validators.required, Validators.maxLength(150), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]],
    })
  }

  // Hook ngOnInit pour initialiser les composants.
  ngOnInit (): void {
    // S'abonne à un observable pour recevoir des messages d'erreur d'authentification.
    this.userSubscription = this._authService.$errorConnection.subscribe({
      next: (errormessage) => {
          this.errorMessage = errormessage;
      }
    })
  }

  // Hook ngOnDestroy pour nettoyer les ressources avant la destruction du composant.
  ngOnDestroy (): void {
    // Se désabonne de l'observable pour éviter les fuites de mémoire.
    this.userSubscription.unsubscribe();
  }
  
  // Méthode pour gérer le processus de connexion.
  login(): void {
    // Vérifie si le formulaire est valide.
    if (this.loginForm.valid) {
      // Appelle le service d'authentification pour effectuer la connexion.
      this._authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // Si la connexion réussit, redirige vers le tableau de bord.
          if (response != undefined) {
            this.errorMessage = undefined;
            this._router.navigateByUrl('/dashboard-monitor');
          }
        },
        error: (error) => {
          // Gère les erreurs lors de la connexion.
          console.error("Une erreur s'est produite lors de la connexion :", error);
        },
        complete: () => {
          // Log à la fin du processus de connexion.
          console.log("Connexion terminée.");
        }
      });
    }
  }

  // Méthode pour gérer la déconnexion.
  logout(): void {
    // Supprime le token du stockage local.
    localStorage.removeItem('money-tracker-token');
    // Appelle la méthode de déconnexion du service d'authentification.
    this._authService.logout();
  }
}
