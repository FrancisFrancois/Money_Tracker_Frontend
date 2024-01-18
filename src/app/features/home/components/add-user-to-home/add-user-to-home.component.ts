import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from '../../services/home.service';
import { UserService } from 'src/app/features/user/services/user.service';
import { Router } from '@angular/router';
import { ListUser } from 'src/app/features/user/models/user';
import { ListHome } from '../../models/home';

@Component({
  selector: 'app-add-user-to-home',
  templateUrl: './add-user-to-home.component.html',
  styleUrls: ['./add-user-to-home.component.scss']
})
export class AddUserToHomeComponent {

  // Déclaration du formulaire et des listes pour les utilisateurs et les maisons.
  AddUserToHomeForm: FormGroup;
  users: ListUser[] = [];
  homes : ListHome[] = [];

  // Constructeur pour injecter les services nécessaires.
  constructor(
    private _fb : FormBuilder, // Service pour la construction de formulaires.
    private _homeService : HomeService, // Service pour les opérations sur les maisons.
    private _userService : UserService, // Service pour les opérations sur les utilisateurs.
    private _router: Router // Service pour la navigation.
  ) {
    // Initialisation du formulaire avec validation.
    this.AddUserToHomeForm = this._fb.group({
      user_Id : [null, [Validators.required]], // Champ pour l'ID de l'utilisateur.
      home_Id : [null, [Validators.required]], // Champ pour l'ID de la maison.
    })
  }

  // Méthode pour ajouter un utilisateur à une maison.
  addUserToHome(){
    // Vérification si le formulaire est valide.
    if (this.AddUserToHomeForm.valid) {
      // Appel au service pour ajouter l'utilisateur à la maison avec les données du formulaire.
      this._homeService.addUserToHome(this.AddUserToHomeForm.value).subscribe({
        next : (response) => {
          // Navigation vers la liste des maisons après l'ajout.
          this._router.navigateByUrl('/list-home')
        },
        error : (error) => {
          // Gestion des erreurs lors de l'ajout.
          console.log(" Une erreur s'est produite lors de l'ajout de l'utilisateur à la maison", error)
        },
        complete : () => {
          // Message de confirmation après l'ajout.
          console.log("L'utilisateur a bien été ajouté à la maison")
        }
      });
      console.log(this.AddUserToHomeForm.value);
      console.log("FORMULAIRE VALIDE");
    } else {
      // Marque tous les champs du formulaire comme touchés si le formulaire est invalide.
      this.AddUserToHomeForm.markAllAsTouched();
      console.log("FORMULAIRE INVALIDE");
    }
  }

  // Méthode ngOnInit appelée à l'initialisation du composant.
  ngOnInit(): void {
    // Chargement des utilisateurs et des maisons.
    this.loadUsers();
    this.loadHomes();
  }

  // Méthode pour charger les utilisateurs.
  loadUsers() {
    // Appel au service pour obtenir tous les utilisateurs.
    this._userService.getAll().subscribe({
      next: (data) => {
        // Stockage des données des utilisateurs dans la propriété 'users'.
        this.users = data;
      },
      error: (err) => {
        // Gestion des erreurs lors du chargement des utilisateurs.
        console.error('Erreur lors du chargement des utilisateurs', err);
      }
    });
  }

  // Méthode pour charger les maisons.
  loadHomes() {
    // Appel au service pour obtenir toutes les maisons.
    this._homeService.getAll().subscribe({
      next: (data) => {
        // Stockage des données des maisons dans la propriété 'homes'.
        this.homes = data;
      },
      error: (err) => {
        // Gestion des erreurs lors du chargement des maisons.
        console.error('Erreur lors du chargement des maisons', err);
      }
    });
  }
}
