import { Component } from '@angular/core';
import { ReadCategory } from '../../models/category'; // Modèle de données pour une catégorie.
import { ActivatedRoute, Router } from '@angular/router'; // Modules pour la gestion des routes.
import { CategoryService } from '../../services/category.service'; // Service pour les opérations liées aux catégories.

@Component({
  selector: 'app-read-category', 
  templateUrl: './read-category.component.html', 
  styleUrls: ['./read-category.component.scss'] 
})
export class ReadCategoryComponent {
  // Propriété pour stocker les détails de la catégorie 
  readCategory : ReadCategory | undefined;

  // Constructeur pour injecter les dépendances nécessaires.
  constructor(
    private _activeRoute : ActivatedRoute, // Pour accéder aux paramètres de la route active.
    private _categoryService : CategoryService, 
    private _router : Router,
  ) {
    // Récupère l'identifiant de la catégorie depuis l'URL.
    let categoryId = +this._activeRoute.snapshot.params['id'];
    
    // Appel du service pour obtenir les détails de la catégorie par son identifiant.
    this._categoryService.getById(categoryId).subscribe({
      next : (response) => {
        // Assignation des détails de la catégorie à la propriété readCategory.
        this.readCategory = response;
        console.log("Récupération de la catégorie : ", response);
      },
      error : (error) => {
        // Gestion des erreurs lors de la récupération de la catégorie.
        console.error("Erreur lors de la recuperation de la catégorie : ", error);
        // Redirection vers une page 'not-found' en cas d'erreur.
        this._router.navigateByUrl('/not-found');
      },
      complete : () => {
        // Message dans la console indiquant la fin de la récupération des données.
        console.log("Récupération de la catégorie terminée");
      }
    });
  }
}

