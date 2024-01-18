import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

// Déclaration du composant avec son sélecteur, son template HTML et son fichier de style CSS.
@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent {

  // Déclaration du formulaire pour la mise à jour de l'utilisateur et de la propriété pour son identifiant.
  updateUserForm: FormGroup;
  userId: number;

  // Constructeur pour injecter les services nécessaires.
  constructor(
    private _activeRoute: ActivatedRoute, // Service pour accéder aux paramètres de la route.
    private _fb: FormBuilder, // Service FormBuilder pour la création de formulaires.
    private _userService: UserService, // Service pour les opérations sur les utilisateurs.
    private _router: Router // Service Router pour la navigation.
  ) {
    // Récupération de l'ID de l'utilisateur à partir de l'URL.
    this.userId = +this._activeRoute.snapshot.params['id'];
    
    // Initialisation du formulaire avec des champs et des validateurs.
    this.updateUserForm = this._fb.group({
      lastname: [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
      firstname: [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
      pseudo: [null, [Validators.required, Validators.maxLength(45), Validators.pattern(/^[\D]*$/)]],
      email: [null, [Validators.required, Validators.maxLength(250), Validators.email]],
      password: [null, [Validators.required, Validators.maxLength(150), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]],
      roles: [null, [Validators.required]],
    })
  }

  // Méthode ngOnInit appelée lors de l'initialisation du composant.
  ngOnInit(): void {
    // Appel au service UserService pour obtenir les détails de l'utilisateur et pré-remplir le formulaire.
    this._userService.getById(this.userId).subscribe({
      next: (user) => {
        this.updateUserForm.patchValue(user);
      }
    })
  }

  // Méthode pour mettre à jour les informations de l'utilisateur.
  updateUser(): void {
    // Appel au service UserService pour mettre à jour l'utilisateur avec les données du formulaire.
    this._userService.update(this.userId, this.updateUserForm.value).subscribe({
      next: () => {
        // Affichage d'un message en cas de succès et redirection vers la liste des utilisateurs.
        console.log('L\'utilisateur a été mis à jour');
        this._router.navigateByUrl('/list-user');
      },
      error: (error) => {
        // Gestion des erreurs en cas d'échec de la mise à jour.
        console.error('Une erreur s\'est produite lors de la mise à jour de l\'utilisateur:', error);
      },
      complete: () => {
        // Message de confirmation une fois la mise à jour terminée.
        console.log('Mise à jour de l\'utilisateur terminée');
      }
    });
  }
}

