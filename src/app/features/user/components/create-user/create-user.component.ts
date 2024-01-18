import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

// Déclaration du composant avec son sélecteur, son template HTML et son fichier de style CSS.
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {

  // Déclaration du formulaire pour la création d'un utilisateur.
  createUserForm: FormGroup;

  // Constructeur pour injecter les services nécessaires.
  constructor(
    private _fb: FormBuilder, // Injection du FormBuilder pour la création de formulaires.
    private _userService: UserService, // Injection du service pour les opérations sur les utilisateurs.
    private _router: Router // Injection du service Router pour la navigation.
  ) {
    // Initialisation du formulaire avec des champs et des validateurs.
    this.createUserForm = this._fb.group({
      lastname: [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
      firstname: [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
      pseudo: [null, [Validators.required, Validators.maxLength(45), Validators.pattern(/^[\D]*$/)]],
      email: [null, [Validators.required, Validators.maxLength(250), Validators.email]],
      password: [null, [Validators.required, Validators.maxLength(150), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]],
      roles: [null, [Validators.required]],
    })
  }

  // Méthode pour créer un utilisateur.
  createUser(): void {
    // Vérifie si le formulaire est valide avant de soumettre les données.
    if (this.createUserForm.valid) {
      // Appel au service UserService pour créer un utilisateur avec les données du formulaire.
      this._userService.create(this.createUserForm.value).subscribe({
        next: (response) => {
          // Affichage d'un message en cas de succès et redirection vers la liste des utilisateurs.
          console.log("Utilisateur créé avec succès:", response);
          this._router.navigateByUrl('/list-user');
        },
        error: (error) => {
          // Gestion des erreurs en cas d'échec de la création.
          console.error("Une erreur s'est produite lors de la création de l'utilisateur:", error);
        },
        complete: () => {
          // Message de confirmation une fois la création terminée.
          console.log("Création de l'utilisateur terminée.");
        }
      });
      console.log(this.createUserForm.value);
      console.log("FORMULAIRE VALIDE");
    } else {
      // Marquage de tous les champs du formulaire comme touchés si le formulaire est invalide.
      this.createUserForm.markAllAsTouched();
      console.log("FORMULAIRE INVALIDE");
    }
  }
}

