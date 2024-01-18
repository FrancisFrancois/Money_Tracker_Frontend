import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from '../../services/home.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/features/user/services/user.service';
import { ListUser } from 'src/app/features/user/models/user';

// Déclaration du composant avec son sélecteur, son template HTML et son fichier de style CSS.
@Component({
  selector: 'app-create-home',
  templateUrl: './create-home.component.html',
  styleUrls: ['./create-home.component.scss']
})
export class CreateHomeComponent {

  // Création d'une propriété pour le formulaire et une liste pour stocker les utilisateurs.
  createHomeForm: FormGroup;
  users: ListUser[] = [];

  // Constructeur pour injecter les dépendances nécessaires.
  constructor(
    private _fb: FormBuilder, // Injection du FormBuilder pour la création de formulaires.
    private _homeService: HomeService, // Injection du service pour les opérations sur les maisons.
    private _userService: UserService, // Injection du service pour les opérations sur les utilisateurs.
    private _router: Router // Injection du service Router pour la navigation.
  ) {
    // Initialisation du formulaire avec des champs pour l'ID de l'utilisateur et le nom de la maison, avec des validations nécessaires.
    this.createHomeForm = this._fb.group({
      user_Id: [null, [Validators.required]],
      name_Home: [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
    })
  }

  // Méthode pour créer une maison.
  createHome() {
    // Vérification si le formulaire est valide.
    if (this.createHomeForm.valid) {
      // Appel au service HomeService pour créer une maison avec les données du formulaire.
      this._homeService.create(this.createHomeForm.value).subscribe({
        next: (response) => {
          // Navigation vers une autre route (/list-home) en cas de succès.
          console.log("Maison ajoutée avec succès:", response);
          this._router.navigateByUrl('/list-home');
        },
        error: (error) => {
          // Affichage d'un message d'erreur en cas d'échec de la requête.
          console.error("Une erreur s'est produite lors de la création de la maison:", error);
        },
        complete: () => {
          // Affichage d'un message de confirmation une fois l'opération complète.
          console.log("Création de la maison terminée.");
        }
      });
      console.log(this.createHomeForm.value); 
      console.log("FORMULAIRE VALIDE");
    } else {
      // Marquage de tous les champs du formulaire comme touchés si le formulaire est invalide.
      this.createHomeForm.markAllAsTouched();
      console.log("FORMULAIRE INVALIDE");
    }
  }

  // Méthode ngOnInit appelée lors de l'initialisation du composant.
  ngOnInit(): void {
    // Appel de la méthode pour charger les données des utilisateurs.
    this.loadUsers();
  }

  // Méthode pour charger la liste des utilisateurs.
  loadUsers() {
    // Appel au UserService pour récupérer tous les utilisateurs.
    this._userService.getAll().subscribe({
      next: (data) => {
        // Stockage des données récupérées dans la propriété 'users'.
        this.users = data;
      },
      error: (err) => {
        // Gestion des erreurs lors de la récupération des données des utilisateurs.
        console.error('Erreur lors du chargement des utilisateurs', err);
      }
    });
  }
}
