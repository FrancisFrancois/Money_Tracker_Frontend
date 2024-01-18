import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../../services/home.service';

// Déclaration du composant avec son sélecteur, son template HTML et son fichier de style CSS.
@Component({
  selector: 'app-update-home',
  templateUrl: './update-home.component.html',
  styleUrls: ['./update-home.component.scss']
})
export class UpdateHomeComponent {

  // Déclaration du formulaire pour la mise à jour et de la propriété pour l'identifiant de la maison.
  updateHomeForm: FormGroup;
  categoryId: number;

  // Constructeur pour injecter les services et les dépendances nécessaires.
  constructor(
    private _activeRoute: ActivatedRoute, // Service pour accéder aux paramètres de la route.
    private _fb: FormBuilder, // Service FormBuilder pour la création de formulaires.
    private _homeService: HomeService, // Service pour les opérations sur les maisons.
    private _router: Router // Service Router pour la navigation.
  ) {
    // Récupération de l'ID de la maison à partir de l'URL.
    this.categoryId = +this._activeRoute.snapshot.params['id'];
    
    // Initialisation du formulaire avec des champs et des validateurs.
    this.updateHomeForm = this._fb.group({
      name_Home: [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\D]*$/)]],
    })
  }

  // Méthode ngOnInit appelée lors de l'initialisation du composant.
  ngOnInit(): void {
    // Appel au service pour obtenir les détails de la maison et pré-remplir le formulaire.
    this._homeService.getById(this.categoryId).subscribe({
      next: (home) => {
        this.updateHomeForm.patchValue(home);
      }
    })
  }

  // Méthode pour mettre à jour les informations de la maison.
  updateHome(): void {
    // Appel au service HomeService pour mettre à jour la maison avec les données du formulaire.
    this._homeService.update(this.categoryId, this.updateHomeForm.value).subscribe({
      next: () => {
        // Affichage d'un message en cas de succès et redirection vers la liste des maisons.
        console.log('La catégorie a été mise à jour');
        this._router.navigateByUrl('/list-home');
      },
      error: (error) => {
        // Gestion des erreurs en cas d'échec de la mise à jour.
        console.error('Une erreur s\'est produite lors de la mise à jour de la catégorie :', error);
      },
      complete: () => {
        // Message de confirmation une fois la mise à jour terminée.
        console.log('Mise à jour de la catégorie terminée');
      }
    });
  }
}
